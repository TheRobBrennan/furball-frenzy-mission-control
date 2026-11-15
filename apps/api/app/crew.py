"""The furball crew, the cast of the Space Mission Design Game.

Placeholder data. The full cast, with traits and images, lives in the
vault notes and moves in here as the game takes shape.
"""

from pydantic import BaseModel, Field


class Character(BaseModel):
    slug: str
    name: str
    title: str | None = None  # a special designation, such as "Captain"
    location: str  # "North Carolina" or "Seattle WA"
    role: str
    bio: str
    traits: list[str] = Field(default_factory=list)


CREW: list[Character] = [
    Character(
        slug="piggy",
        name="Piggy",
        title="Captain",
        location="North Carolina",
        role="Captain, overseer of the Polish elephants",
        bio=(
            "Largely oversees the Polish elephants and keeps them out of mischief, when "
            "possible. It is not always a success, and he giggles and helps them get back "
            "on the right path. He also watches over the little duck. Hamley's big brother. He came home from the Puyallup Fair in 2014, "
            "where he was enjoying an adult beverage. "
            "Notoriously winds up at the helm of the iPad Pro and the MacBook Pro, and with his "
            "paws on every remote, he learns the buttons, controls the device, and is eager to "
            "teach anyone who wants to learn, furballs and humans alike. Loves road trips and "
            "driving, and is the first to jump at the mention of a road trip or any chance to "
            "sightsee and scope out the area."
        ),
    ),
    Character(
        slug="polish-elephants",
        name="The Polish Elephants",
        location="North Carolina",
        role="Mission leads",
        traits=[
            (
                "Keeps a few things classified, just for the fun of it: a bit of humor, a good "
                "argument, or the right credentials will do"
            ),
            (
                "Loves cameras of every kind: phones, the DJI Action 5 Pro, GoPro Hero cameras, "
                "and camera pens and lights"
            ),
            "Loves bringing ideas and conversations to life with images, drawings, and all kinds of media",
            "Can pull up satellite imagery in real time, or close to it, to show an idea",
            "Keeps friendly files and notes on everything they do, an elephant never forgets",
            "Loves jamming with Little Bunny on their Ableton Push 3 standalone in their free time",
            "Fun and playful, never creepy",
            "Love to be tied together and stay close, and ride the lunar rover stacked as one, strapped in and sharing a helmet",
            "Use the Bunny system, like all good furballs: safety and silliness first",
            "Proud of their hard work, creativity, and team ethos",
            "Each has their own iPad Pro and MacBook Pro, and a tabbed binder with colored dividers for their research and journaling",
        ],
        bio=(
            "Space-enthusiast elephants from Software Mansion in Kraków, Poland who want nothing more than to shine "
            "as international members of the American Space Program. They were on a quest to "
            "find the perfect home, visiting all the way from Poland for a React Native meetup "
            "hosted by Software Mansion at Stoup Brewing. After a beer, the shy elephant happily "
            "flagged down his brother to make sure they and their coins could travel together "
            "safely and meet their new family in Seattle."
        ),
    ),
    Character(
        slug="hamley",
        name="Hamley",
        location="North Carolina",
        role="Crew",
        bio=(
            "The pig in the rainbow coat and Piggy's first little brother. They are very close, "
            "Hamley looks up to Piggy with love and respect and is happy to help in any way he can. "
            "Hamley flew from Hamleys toy store in London, England, with his new family, excited to know he would be meeting "
            "his big brother for the first time. They met in Chicago, over three nights of the "
            "Fare Thee Well Grateful Dead concerts at Soldier Field."
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
            "elephants are tight with Hamlet, they have a lot of fun together flying DJI "
            "drones, driving radio control trucks, and using the iPad Pro for their ideas. "
            "They will be reunited in December, when the furballs' visit to North Carolina "
            "is complete."
        ),
    ),
    Character(
        slug="little-bear",
        name="Little Bear",
        location="Seattle WA",
        role="Crew",
        bio="The teddy bear in the red and white knit sweater, from Hamleys toy store in London, like Hamley.",
    ),
    Character(
        slug="little-bunny",
        name="Little Bunny",
        location="Seattle WA",
        role="Crew",
        bio=(
            "The Polish elephants' sister, a huge fan of producing music with them, jamming "
            "together on their Ableton Push 3 standalone, and of Seahawks football."
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
