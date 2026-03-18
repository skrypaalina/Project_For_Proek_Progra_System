from fastapi import FastAPI
from routes import auth, movies, sessions, booking, payments

app = FastAPI()

app.include_router(auth.router)
app.include_router(movies.router)
app.include_router(sessions.router)
app.include_router(booking.router)
app.include_router(payments.router)