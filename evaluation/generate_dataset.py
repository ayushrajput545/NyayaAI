import json
from pathlib import Path

from src.config.db import LocalSession
from src.services.advance_rag_services import advanced_search
from src.services.rag_service import generate_answer

ADMIN_USER_ID=3

BASE_DIR = Path(__file__).resolve().parent

INPUT_FILE = BASE_DIR / "dataset" / "legal_questions.json"

OUTPUT_FILE = BASE_DIR / "results" / "ragas_dataset.json"

def generate_evaluation_dataset():

    with open(INPUT_FILE, "r", encoding="utf-8") as file:
        questions = json.load(file)

    db = LocalSession()
    evaluation_data = []

    try:

        for i in range(len(questions)):

            question = questions[i]["question"]
            reference = questions[i]["reference"]

            print(f"\nProcessing Question {i + 1}/{len(questions)}")
            print(question)

            # 2. Retrieve relevant chunks using existing pipeline
            search_results = advanced_search(
                db,
                question,
                ADMIN_USER_ID
            )

            # 3. Handle insufficient retrieval
            if len(search_results) == 0:

                answer = (
                    "I couldn't find sufficiently relevant information "
                    "in your uploaded documents to answer this question."
                )

                contexts = []

            else:

                # 4. Build context in the same format as existing RAG
                context = ""

                for j in range(len(search_results)):

                    context += f"""
                    Document: {search_results[j]['filename']}
                    Page: {search_results[j]['page_number']}
                    Content: {search_results[j]['content']}
                    """

                # 5. Generate answer using existing Groq function
                answer = generate_answer(
                    question,
                    context,
                    []
                )

                # 6. Capture actual retrieved chunks
                contexts = []

                for j in range(len(search_results)):
                    contexts.append(search_results[j]["content"])

            # 7. Store evaluation record
            evaluation_data.append({
                "user_input": question,
                "response": answer,
                "retrieved_contexts": contexts,
                "reference": reference
            })

            print("Answer generated successfully!")

    finally:
        db.close()

    # 8. Save evaluation dataset
    with open(OUTPUT_FILE, "w", encoding="utf-8") as file: #saves your generated RAG evaluation dataset into a JSON file

        json.dump( #Python data into JSON and save it
            evaluation_data,
            file,
            indent=4,
            ensure_ascii=False
        )

    print("\nEvaluation dataset generated!")
    print(f"Total questions: {len(evaluation_data)}")
    print(f"Saved at: {OUTPUT_FILE}")


if __name__ == "__main__":
    generate_evaluation_dataset()

# RUN: python -m evaluation.generate_dataset