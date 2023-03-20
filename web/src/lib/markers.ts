export interface Room {
  top: number;
  left: number;
  roomName: string;
  floor: 1 | 2;
}

export const markers: Room[] = [
  {
    top: 168,
    left: 25,
    roomName: "S114",
    floor: 1,
  },
  {
    top: 188,
    left: 20,
    roomName: "S115",
    floor: 1,
  },
  {
    top: 235,
    left: 20,
    roomName: "S116",
    floor: 1,
  },
  {
    top: 256,
    left: 60,
    roomName: "S117",
    floor: 1,
  },
  {
    top: 254,
    left: 88,
    roomName: "S118",
    floor: 1,
  },
  {
    top: 256,
    left: 116,
    roomName: "S119",
    floor: 1,
  },
  {
    top: 254,
    left: 141,
    roomName: "A???",
    floor: 1,
  },
  {
    top: 249,
    left: 165,
    roomName: "S120",
    floor: 1,
  },
  {
    top: 249,
    left: 191,
    roomName: "O???",
    floor: 1,
  },
  {
    top: 246,
    left: 209,
    roomName: "S121",
    floor: 1,
  },
  {
    top: 235,
    left: 252,
    roomName: "S101",
    floor: 1,
  },
  {
    top: 235,
    left: 279,
    roomName: "S102",
    floor: 1,
  },
  {
    top: 199,
    left: 309,
    roomName: "S103",
    floor: 1,
  },
  {
    top: 180,
    left: 301,
    roomName: "S104",
    floor: 1,
  },
  {
    top: 169,
    left: 301,
    roomName: "S105",
    floor: 1,
  },
  {
    top: 154,
    left: 301,
    roomName: "S106",
    floor: 1,
  },
  {
    top: 140,
    left: 301,
    roomName: "S107",
    floor: 1,
  },
  {
    top: 123,
    left: 301,
    roomName: "S108",
    floor: 1,
  },
  {
    top: 100,
    left: 301,
    roomName: "S109",
    floor: 1,
  },
  {
    top: 200,
    left: 251,
    roomName: "A1",
    floor: 1,
  },
  {
    top: 197,
    left: 229,
    roomName: "S110",
    floor: 1,
  },
  {
    top: 204,
    left: 208,
    roomName: "A2",
    floor: 1,
  },
  {
    top: 204,
    left: 176,
    roomName: "S111",
    floor: 1,
  },
  {
    top: 170,
    left: 89,
    roomName: "S112",
    floor: 1,
  },
  {
    top: 164,
    left: 53,
    roomName: "A3",
    floor: 1,
  },
  {
    top: 261,
    left: 50,
    roomName: "S211",
    floor: 2,
  },
  {
    top: 259,
    left: 78,
    roomName: "S210",
    floor: 2,
  },
  {
    top: 259,
    left: 105,
    roomName: "S209",
    floor: 2,
  },
  {
    top: 253,
    left: 160,
    roomName: "S207",
    floor: 2,
  },
  {
    top: 252,
    left: 184,
    roomName: "S207",
    floor: 2,
  },
  {
    top: 252,
    left: 202,
    roomName: "S207",
    floor: 2,
  },
  {
    top: 240,
    left: 249,
    roomName: "S201",
    floor: 2,
  },
  {
    top: 240,
    left: 278,
    roomName: "S202",
    floor: 2,
  },
  {
    top: 190,
    left: 295,
    roomName: "ART",
    floor: 2,
  },
  {
    top: 113,
    left: 295,
    roomName: "ARB",
    floor: 2,
  },
  {
    top: 200,
    left: 251,
    roomName: "S204",
    floor: 2,
  },
  {
    top: 204,
    left: 189,
    roomName: "S205",
    floor: 2,
  },
  {
    top: 204,
    left: 172,
    roomName: "S206",
    floor: 2,
  },
];

export const getNonAdjacentRooms = (
  rooms: Room[],
  foundRooms: Room[]
): Room[] => {
  const remainingRooms = rooms.filter((room) => !foundRooms.includes(room));
  const shuffledRooms = shuffleArray(remainingRooms);

  let nonAdjacentRooms: Room[] = [];

  for (
    let i = 0;
    i < shuffledRooms.length && nonAdjacentRooms.length < 4;
    i++
  ) {
    const room = shuffledRooms[i];

    if (
      !nonAdjacentRooms.some((r) => isAdjacent(r, room)) &&
      nonAdjacentRooms.every((r) => r.floor !== room.floor)
    ) {
      nonAdjacentRooms.push(room);
    }
  }

  return nonAdjacentRooms;
};

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffledArray = [...array];

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }

  return shuffledArray;
};

const isAdjacent = (room1: Room, room2: Room): boolean => {
  return (
    Math.abs(room1.left - room2.left) <= 1 &&
    Math.abs(room1.top - room2.top) <= 1 &&
    room1.floor === room2.floor
  );
};
