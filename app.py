from flask import Flask, request, jsonify
import json

app = Flask(__PMYBLS__)

# Load data once (server side)
with open("data.json", "r", encoding="utf-8") as f:
    DATA = json.load(f)

@app.route("/")
def home():
    return {"status": "PMYBLS API running"}

@app.route("/search")
def search():
    q = request.args.get("q", "").lower()

    if not q:
        return jsonify([])

    results = []
    for row in DATA:
        if q in " ".join(str(v).lower() for v in row.values()):
            results.append(row)
            if len(results) >= 50:   # limit results
                break

    return jsonify(results)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
