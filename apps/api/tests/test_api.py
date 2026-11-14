from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_crew_lists_both_locations() -> None:
    response = client.get("/crew")
    assert response.status_code == 200
    locations = {c["location"] for c in response.json()}
    assert locations == {"North Carolina", "Seattle WA"}


def test_polish_elephants_are_in_the_crew() -> None:
    response = client.get("/crew/polish-elephants")
    assert response.status_code == 200
    assert response.json()["name"] == "The Polish Elephants"


def test_unknown_furball_is_404() -> None:
    assert client.get("/crew/nobody").status_code == 404
