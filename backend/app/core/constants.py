from enum import Enum

class RelationType(str, Enum):
    CAN_TEACH = "CAN_TEACH"
    WANTS_TO_LEARN = "WANTS_TO_LEARN"

class NodeType(str, Enum):
    USER = "user"
    SKILL = "skill"
