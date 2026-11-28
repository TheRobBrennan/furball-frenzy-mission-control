import re
from pathlib import Path

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


def test_piggy_is_a_captain_who_watches_the_elephants_and_the_duck() -> None:
    response = client.get("/crew/piggy")
    assert response.status_code == 200
    piggy = response.json()
    assert piggy["name"] == "Piggy"
    assert piggy["title"] == "Captain"
    assert "little duck" in piggy["bio"]


def test_north_carolina_roster_includes_the_gray_elephant_and_the_little_duck() -> None:
    names = {c["name"] for c in client.get("/crew").json() if c["location"] == "North Carolina"}
    assert {"Piggy", "The Gray Elephant", "The Little Duck"} <= names


def test_each_roster_starts_with_its_captain() -> None:
    crew = client.get("/crew").json()
    for location in ("North Carolina", "Seattle WA"):
        first = next(c for c in crew if c["location"] == location)
        assert first["title"] == "Captain"


def test_polish_elephants_are_playful_camera_lovers_with_a_few_classified_files() -> None:
    elephants = client.get("/crew/polish-elephants").json()
    traits = " ".join(elephants["traits"]).lower()
    assert "classified" in traits
    assert "camera" in traits
    assert "waving to their family" in traits
    assert "satellite" in traits
    assert "playful" in traits


def test_parade_day_furballs_are_in_the_crew() -> None:
    assert "Kauaʻi" in client.get("/crew/mister-bunny").json()["bio"]
    for slug in ("blitz", "cool-bird"):
        assert client.get(f"/crew/{slug}").json()["role"] == "Marching band"


def test_meet_the_crew_on_the_site_lists_everyone_the_headcount_counts() -> None:
    page = Path(__file__).parents[2] / "web/src/components/fleet/HomeBases.tsx"
    rosters = re.findall(r"const (?:carolina|seattle)Crew: Member\[\] = \[(.*?)\n\];", page.read_text(), re.DOTALL)
    # A line can hold a pair of buddies, such as "Kraken Bear and Mankind".
    listed = [n for r in rosters for line in re.findall(r'name: "([^"]+)"', r) for n in line.split(" and ")]
    assert sorted(listed) == sorted(c["name"] for c in client.get("/crew").json())
