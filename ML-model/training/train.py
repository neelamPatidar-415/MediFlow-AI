from datasets import load_dataset
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib
import os


# 1. Load ADE Corpus V2
dataset = load_dataset("SetFit/ade_corpus_v2_classification")

train_data = dataset["train"]
test_data = dataset["test"]


# 2. Extract text and labels
X_train = train_data["text"]
y_train = train_data["label"]

X_test = test_data["text"]
y_test = test_data["label"]


# 3. Build ML pipeline
model = Pipeline([
    (
        "tfidf",
        TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2)
        )
    ),
    (
        "classifier",
        LogisticRegression(
            max_iter=1000
        )
    )
])


# 4. Train
print("Training model...")
model.fit(X_train, y_train)


# 5. Evaluate
print("\nEvaluating model...")

predictions = model.predict(X_test)

print(classification_report(
    y_test,
    predictions,
    target_names=["Non-ADR", "ADR"]
))


# 6. Save trained model
os.makedirs("model", exist_ok=True)

joblib.dump(
    model,
    "model/adr_model.joblib"
)

print("\nModel saved to model/adr_model.joblib")