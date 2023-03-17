export interface Room {
  top: number;
  left: number;
  roomName: string;
}

export const markers: Room[] = [
  {
    top: 168,
    left: 25,
    roomName: "S114",
  },
  {
    top: 188,
    left: 20,
    roomName: "S115",
  },
  {
    top: 235,
    left: 20,
    roomName: "S116",
  },
  {
    top: 256,
    left: 60,
    roomName: "S117",
  },
  {
    top: 254,
    left: 88,
    roomName: "S118",
  },
  {
    top: 256,
    left: 116,
    roomName: "S119",
  },
  {
    top: 254,
    left: 141,
    roomName: "A???",
  },
  {
    top: 249,
    left: 165,
    roomName: "S20",
  },
  {
    top: 249,
    left: 191,
    roomName: "O???",
  },
  {
    top: 246,
    left: 209,
    roomName: "S121",
  },
  {
    top: 235,
    left: 252,
    roomName: "S101",
  },
  {
    top: 235,
    left: 279,
    roomName: "S102",
  },
  {
    top: 199,
    left: 309,
    roomName: "S103",
  },
  {
    top: 180,
    left: 301,
    roomName: "S104",
  },
  {
    top: 169,
    left: 301,
    roomName: "S105",
  },
  {
    top: 154,
    left: 301,
    roomName: "S106",
  },
  {
    top: 140,
    left: 301,
    roomName: "S107",
  },
  {
    top: 123,
    left: 301,
    roomName: "S108",
  },
  {
    top: 100,
    left: 301,
    roomName: "S109",
  },
  {
    top: 200,
    left: 251,
    roomName: "A1",
  },
  {
    top: 197,
    left: 229,
    roomName: "S110",
  },
  {
    top: 204,
    left: 208,
    roomName: "A2",
  },
  {
    top: 204,
    left: 176,
    roomName: "S111",
  },
  {
    top: 170,
    left: 89,
    roomName: "S112",
  },
  {
    top: 164,
    left: 53,
    roomName: "A3",
  },
];

export const getNonAdjacentRooms = (
  rooms: Room[],
  previousRooms: Room[]
): Room[] => {
  const selectedRooms: Room[] = [];

  while (selectedRooms.length < 6) {
    const candidateRoom = rooms[Math.floor(Math.random() * rooms.length)];
    if (
      !selectedRooms.includes(candidateRoom) &&
      !previousRooms.some((room) => areAdjacent(room, candidateRoom)) &&
      !selectedRooms.some((room) => areAdjacent(room, candidateRoom))
    ) {
      selectedRooms.push(candidateRoom);
    }
  }

  return selectedRooms;
};

const areAdjacent = (room1: Room, room2: Room): boolean => {
  const horizontalDistance = Math.abs(room1.left - room2.left);
  const verticalDistance = Math.abs(room1.top - room2.top);
  const minDistance = 50;

  return horizontalDistance < minDistance && verticalDistance < minDistance;
};
