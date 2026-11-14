"""The furball crew, the cast of the Space Mission Design Game.

Placeholder data. The full cast, with traits and images, lives in the
vault notes and moves in here as the game takes shape.
"""

from pydantic import BaseModel


class Character(BaseModel):
    slug: str
    name: str
    title: str | None = None  # a special designation, such as "Captain"
    location: str  # "North Carolina" or "Seattle WA"
    role: str
    bio: str


CREW: list[Character] = [
    Character(
        slug="polish-elephants",
        name="The Polish Elephants",
        location="North Carolina",
        role="Mission leads",
        bio=(
            "Space-enthusiast elephants from Poland who want nothing more than to shine "
            "as international members of the American Space Program."
        ),
    ),
    Character(
        slug="piggy",
        name="Piggy",
        title="Captain",
        location="North Carolina",
        role="Captain, overseer of the Polish elephants",
        bio=(
            "Largely oversees the Polish elephants and keeps them out of mischief, when "
            "possible. It is not always a success, and he giggles and helps them get back "
            "on the right path. He also watches over the little duck. Hamley's big brother. "
            "Notoriously winds up at the helm of the iPad Pro and the MacBook Pro, and with his "
            "paws on every remote, he learns the buttons, controls the device, and is eager to "
            "teach anyone who wants to learn, furballs and humans alike. Loves road trips and "
            "driving, and is the first to jump at the mention of a road trip or any chance to "
            "sightsee and scope out the area."
        ),
    ),
    Character(
        slug="hamley",
        name="Hamley",
        location="North Carolina",
        role="Crew",
        bio=(
            "The pig in the rainbow coat and Piggy's first little brother. They are very close, "
            "Hamley looks up to Piggy with love and respect and is happy to help in any way he can."
        ),
    ),
    Character(
        slug="blue-bear",
        name="Blue Bear",
        location="North Carolina",
        role="Recruit",
        bio="The newest recruit to the bunch.",
    ),
    Character(
        slug="gray-elephant",
        name="The Gray Elephant",
        location="North Carolina",
        role="Crew",
        bio="The larger gray elephant of the North Carolina crew.",
    ),
    Character(
        slug="little-duck",
        name="The Little Duck",
        location="North Carolina",
        role="Crew",
        bio="A little pink duck that Piggy watches over, along with the Polish elephants.",
    ),
    Character(
        slug="hamlet",
        name="Hamlet",
        title="Captain",
        location="Seattle WA",
        role="Captain and drone pilot",
        bio=(
            "An experienced drone pilot who leads the technological charge for the "
            "American Space Program along with the Polish elephants. Piggy and the Polish "
            "elephants used to have a lot of fun with Hamlet, flying DJI drones, driving radio "
            "control trucks, and using the iPad Pro for their ideas."
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
