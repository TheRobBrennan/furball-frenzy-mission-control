from fastapi import FastAPI, HTTPException

from app.crew import CREW, Character

app = FastAPI(
    title="Furball Frenzy: Mission Control API",
    description="Backend for the Space Mission Design Game, a NASA Space Apps Challenge 2026 project.",
    version="0.1.0",
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "furball-frenzy-api"}


@app.get("/crew", response_model=list[Character])
def list_crew() -> list[Character]:
    return CREW


@app.get("/crew/{slug}", response_model=Character)
def get_character(slug: str) -> Character:
    for character in CREW:
        if character.slug == slug:
            return character
    raise HTTPException(status_code=404, detail="No such furball")
