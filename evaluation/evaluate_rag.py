
from ragas.llms import LangchainLLMWrapper
from ragas.embeddings import LangchainEmbeddingsWrapper
from ragas.dataset_schema import SingleTurnSample

from src.services.rag_service import llm, embedding_model
from ragas.metrics import faithfulness, answer_relevancy

import json
import asyncio
from pathlib import Path
from statistics import mean


BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = BASE_DIR / "results" / "ragas_dataset.json"
OUTPUT_FILE = BASE_DIR / "results" / "ragas_scores.json"


# 1. Wrap existing Groq LLM and HuggingFace embeddings
evaluator_llm = LangchainLLMWrapper(llm)
evaluator_embeddings = LangchainEmbeddingsWrapper(embedding_model)


# 2. Configure RAGAS metrics
faithfulness.llm = evaluator_llm

answer_relevancy.llm = evaluator_llm
answer_relevancy.embeddings = evaluator_embeddings


async def evaluate_dataset():

    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        dataset = json.load(f)

    evaluation_results = []

    faithfulness_scores = []
    answer_relevancy_scores = []

    for i, item in enumerate(dataset):

        question = item["user_input"]
        answer = item["response"]
        contexts = item["retrieved_contexts"]

        print(f"\nEvaluating Question {i + 1}/{len(dataset)}")

        # 3. Faithfulness Evaluation
        if contexts:

            faith_sample = SingleTurnSample(
                user_input=question,
                response=answer,
                retrieved_contexts=contexts
            )

            faith_result = await faithfulness.single_turn_ascore(
                faith_sample
            )

            faithfulness_score = float(faith_result)
            faithfulness_scores.append(faithfulness_score)

        else:

            faithfulness_score = None
            print("Faithfulness skipped: No retrieved context.")

        # 4. Answer Relevancy Evaluation
        relevancy_sample = SingleTurnSample(
            user_input=question,
            response=answer
        )

        relevancy_result = await answer_relevancy.single_turn_ascore(
            relevancy_sample
        )

        relevancy_score = float(relevancy_result)
        answer_relevancy_scores.append(relevancy_score)

        # 5. Store individual results
        evaluation_results.append({
            "question": question,
            "faithfulness": faithfulness_score,
            "answer_relevancy": relevancy_score,
        })

        print("Faithfulness:", faithfulness_score)
        print("Answer Relevancy:", relevancy_score)

    # 6. Calculate averages
    report = {
        "total_questions": len(dataset),

        "faithfulness_evaluated": len(faithfulness_scores),
        "answer_relevancy_evaluated": len(answer_relevancy_scores),

        "average_faithfulness": (
            mean(faithfulness_scores)
            if faithfulness_scores else None
        ),

        "average_answer_relevancy": (
            mean(answer_relevancy_scores)
            if answer_relevancy_scores else None
        ),

        "individual_results": evaluation_results,
    }

    # 7. Save evaluation report
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:

        json.dump(
            report,
            f,
            indent=4,
            ensure_ascii=False
        )

    # 8. Print final report
    print("\n========== RAGAS EVALUATION ==========")

    print("Total Questions:", len(dataset))
    print("Faithfulness Evaluated:", len(faithfulness_scores))
    print("Answer Relevancy Evaluated:", len(answer_relevancy_scores))

    print("Average Faithfulness:", report["average_faithfulness"])
    print("Average Answer Relevancy:", report["average_answer_relevancy"])

    print("\nResults saved at:", OUTPUT_FILE)


if __name__ == "__main__":
    asyncio.run(evaluate_dataset())


# RUN:
# python -m evaluation.evaluate_rag
