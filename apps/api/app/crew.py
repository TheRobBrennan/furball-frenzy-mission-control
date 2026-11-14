"""The furball crew, the cast of the Space Mission Design Game.

Placeholder data. The full cast, with traits and images, lives in the
vault notes and moves in here as the game takes shape.
"""

from pydantic import BaseModel


class Character(BaseModel):
    slug: str
    name: str
    location: str  # "Rockingham, NC" or "Seattle WA"
    role: str
    bio: str


CREW: list[Character] = [
    Character(
        slug="polish-elephants",
        name="The Polish Elephants",
        location="Rockingham, NC",
        role="Mission leads",
        bio=(
            "Space-enthusiast elephants from Poland who want nothing more than to shine "
            "as international members of the American Space Program."
        ),
    ),
    Character(
        slug="captain-piggy",
        name="Captain Piggy",
        location="Rockingham, NC",
        role="Captain",
        bio="Coordinates with Hamlet, the Polish elephants, and the crew.",
    ),
    Character(
        slug="hamley",
        name="Hamley",
        location="Rockingham, NC",
        role="Crew",
        bio="The pig in the rainbow coat.",
    ),
    Character(
        slug="blue-bear",
        name="Blue Bear",
        location="Rockingham, NC",
        role="Recruit",
        bio="The newest recruit to the bunch.",
    ),
    Character(
        slug="hamlet",
        name="Hamlet",
        location="Seattle WA",
        role="Captain and drone pilot",
        bio=(
            "An experienced drone pilot who leads the technological charge for the "
            "American Space Program along with the Polish elephants."
        ),
    ),
    Character(
        slug="little-bear",
        name="Little Bear",
        location="Seattle WA",
        role="Crew",
        bio="The teddy bear in the red and white knit sweater.",
    ),
    Character(
        slug="little-bunny",
        name="Little Bunny",
        location="Seattle WA",
        role="Crew",
        bio=(
            "The Polish elephants' sister, a huge fan of producing music with them and of "
            "Seahawks football."
        ),
    ),
    Character(
        slug="kraken-bear",
        name="Kraken Bear",
        location="Seattle WA",
        role="Crew",
        bio="Springs to life at the call of Se-at-tle KRA-ken BEARRRR.",
    ),
    Character(
        slug="fuzzy-black-bear",
        name="Fuzzy Black Bear",
        location="Seattle WA",
        role="Crew",
        bio="Has an unpictured twin, Fuzzy Brown Bear.",
    ),
]
