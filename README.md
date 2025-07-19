# Book Recommendation API 📚

A RESTful API built with FastAPI that provides personalized book recommendations based on user preferences using collaborative filtering. It includes a simple Vanilla JS frontend for interaction, SQLite for data storage, and scikit-learn/pandas for the ML model.

This project demonstrates end-to-end development of a data-driven application, from data ingestion to API deployment and frontend integration.

---

## 🚀 Features

- **User Preferences Input**: Users can add ratings (1-5) for books.
- **Personalized Recommendations**: User-based collaborative filtering with cosine similarity.
- **Cold Start Handling**: Fallback to top-rated books for new users.
- **Sparse Data Fallback**: Pads with popular books if too few recommendations are found.
- **Data Storage**: SQLite database from Goodbooks-10k (~10k books, ~1M ratings).
- **Frontend**: Basic HTML + Vanilla JavaScript interface.
- **Optimization**: Precomputes similarity matrix for fast, real-time queries.

---

## 🛠 Tech Stack

- **Backend**: FastAPI, Python 3.8+, Uvicorn
- **Data/ML**: pandas, scikit-learn, SciPy (sparse), SQLite
- **Frontend**: HTML, JavaScript
- **Dataset**: [Goodbooks-10k](https://www.kaggle.com/datasets/zygmunt/goodbooks-10k) from Kaggle

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Autsai-Assignment.git
cd Autsai-Assignment
```

### 2. Set Up Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 📁 Project Structure

```
book-recommendation-api/
├── data/
│   ├── books.csv
│   └── ratings.csv
├── app.py              # FastAPI application
├── database.py         # DB setup and query helpers
├── model.py            # Recommendation engine logic
├── precompute.py       # Run once to precompute similarities
├── index.html          # Frontend
├── books.db            # SQLite DB (auto-generated)
├── user_item_sparse.npz  # Precomputed sparse matrix
├── user_index.pkl
├── book_index.pkl
├── user_similarity.npy
└── requirements.txt
```

---

## 📥 Dataset

1. Download the **Goodbooks-10k** dataset from Kaggle.
2. Place `books.csv` and `ratings.csv` inside the `data/` folder.

---

## 🧱 Initialize Database

```bash
python -c "from database import init_db; init_db()"
```

---

## ⚡ Precompute Similarity Matrix

Run this once to build the similarity matrix. It may take 5–10 minutes depending on your machine.

```bash
python precompute.py
```

**Tip:** To demo quickly, you can uncomment the subsample line in `precompute.py` to limit to 5000 users.

---

## ▶️ Usage

### Run the API Locally

```bash
uvicorn app:app --reload
```

Visit [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for the Swagger UI.

### Example API Endpoints

- `POST /add_rating`: Add a user rating  
  Request body:

  ```json
  {
    "user_id": 99999,
    "book_id": 1,
    "rating": 5
  }
  ```

- `GET /recommend/99999?top_n=5`: Get 5 recommendations for user 99999

---

## 🌐 Frontend (Browser Interface)

1. Open `index.html` in your browser.  
   _(Optional: use the Live Server extension in VS Code for smoother experience.)_

2. Add a few ratings, then click "Get Recommendations" to view results.

---

## 🧪 Testing

- For a **new user**, use `user_id = 99999`, add a few ratings via the form, then fetch recommendations.
- For an **existing user**, use an ID from the dataset (e.g., `30944`) to get instant recommendations.

---

## ⚡ Optimization Notes

Originally, the app recomputed the similarity matrix on every request (~5 mins). Optimizations made:

- Switched to **SciPy sparse matrices** to improve performance and reduce memory.
- **Precomputed** the user-user similarity matrix (run once with `precompute.py`).
- **On-the-fly** similarity only for brand-new users.
- Optionally subsample dataset for demos.

**Result:** Recommendations now return in **under 5 seconds**.

---

## 🌍 Deployment

This app is deployed via [Render](https://render.com/). You can access the live version here:

👉 [Live Demo on Render](https://book-recommendation-api.onrender.com)

To run your own:

1. Create a new **FastAPI** web service on Render.
2. Connect to your GitHub repo.
3. Set the start command as:

```bash
uvicorn app:app --host 0.0.0.0 --port 10000
```

4. Add a `render.yaml` or set build/runtime settings manually.

---

## 💡 Real-World Relevance

This project replicates how major platforms (e.g., Netflix, Amazon, Goodreads) personalize content:

- **Cold Start** and **Sparse Data** challenges are tackled directly.
- Mirrors use-cases like personalized shopping or digital library systems.
- Demonstrates essential skills: data pipelines, recommendation algorithms, database handling, and backend/frontend integration.

---

## 🔧 Potential Improvements

- Add content-based filtering (e.g., author/genre similarity).
- Improve frontend UI with dropdowns/search + CSS styling.
- Deploy behind authentication.
- Use Redis for caching.
- Use Surprise/LightFM for more robust models.
- Add automated unit testing with `pytest`.

---

## 📸 Screenshots

Here’s a glimpse of the frontend:

**Login/Rating Screen**
![Login Page](screenshots/login.png)

**Recommendations View**
![Dashboard](screenshots/dashboard.png)

---

## 📄 License

This project is licensed under the MIT License.  
Feel free to use, modify, and distribute for personal or commercial projects.

---
