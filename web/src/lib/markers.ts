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
    top: 168,
    left: 15,
    roomName: "SXX1",
    floor: 2,
  },
  {
    top: 191,
    left: 8,
    roomName: "SXX2",
    floor: 2,
  },
  {
    top: 208,
    left: 8,
    roomName: "SXX3",
    floor: 2,
  },
  {
    top: 230,
    left: 8,
    roomName: "SXX4",
    floor: 2,
  },
  {
    top: 261,
    left: 50,
    roomName: "SXX5",
    floor: 2,
  },
  {
    top: 259,
    left: 78,
    roomName: "SXX6",
    floor: 2,
  },
  {
    top: 259,
    left: 105,
    roomName: "SXX7",
    floor: 2,
  },
  {
    top: 253,
    left: 160,
    roomName: "SXX8",
    floor: 2,
  },
  {
    top: 252,
    left: 184,
    roomName: "SXX9",
    floor: 2,
  },
  {
    top: 252,
    left: 202,
    roomName: "SX10",
    floor: 2,
  },
  {
    top: 240,
    left: 249,
    roomName: "SX11",
    floor: 2,
  },
  {
    top: 240,
    left: 278,
    roomName: "SX12",
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
    roomName: "SX13",
    floor: 2,
  },
  {
    top: 197,
    left: 229,
    roomName: "SX14",
    floor: 2,
  },
  {
    top: 204,
    left: 208,
    roomName: "SX15",
    floor: 2,
  },
  {
    top: 204,
    left: 189,
    roomName: "SX16",
    floor: 2,
  },
  {
    top: 204,
    left: 172,
    roomName: "SX17",
    floor: 2,
  },
  {
    top: 204,
    left: 152,
    roomName: "SX18",
    floor: 2,
  },
];

export const getNonAdjacentRooms = (
  rooms: Room[],
  previousRooms: Room[]
): Room[] => {
  const selectedRooms: Room[] = [];
  const floor1Rooms: Room[] = [];
  const floor2Rooms: Room[] = [];

  for (const room of rooms) {
    if (room.floor === 1) {
      floor1Rooms.push(room);
    } else if (room.floor === 2) {
      floor2Rooms.push(room);
    }
  }

  while (selectedRooms.length < 10) {
    let candidateRoom: Room;

    if (selectedRooms.filter((room) => room.floor === 1).length < 3) {
      candidateRoom =
        floor1Rooms[Math.floor(Math.random() * floor1Rooms.length)];
    } else if (selectedRooms.filter((room) => room.floor === 2).length < 3) {
      candidateRoom =
        floor2Rooms[Math.floor(Math.random() * floor2Rooms.length)];
    } else {
      const allRooms = [...floor1Rooms, ...floor2Rooms];
      candidateRoom = allRooms[Math.floor(Math.random() * allRooms.length)];
    }

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
  const minDistance = 10;

  return horizontalDistance < minDistance && verticalDistance < minDistance;
};
