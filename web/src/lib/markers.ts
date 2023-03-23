export interface Room {
  top: number;
  left: number;
  roomName: string;
  floor: 1 | 2;
}

export const markers: Room[] = [
  {
    top: 188,
    left: 20,
    roomName: "S115",
    floor: 1,
  },
  {
    top: 205,
    left: 20,
    roomName: "A4",
    floor: 1,
  },
  {
    top: 168,
    left: 68,
    roomName: "A3",
    floor: 1,
  },
  {
    top: 257,
    left: 30,
    roomName: "A5",
    floor: 1,
  },
  {
    top: 256,
    left: 60,
    roomName: "S117",
    floor: 1,
  },
  {
    top: 200,
    left: 251,
    roomName: "A1",
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
    top: 168,
    left: 84,
    roomName: "S113",
    floor: 1,
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
    roomName: "S207a",
    floor: 2,
  },
  {
    top: 252,
    left: 184,
    roomName: "S207b",
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
    roomName: "ARTB",
    floor: 2,
  },
  {
    top: 200,
    left: 251,
    roomName: "S204",
    floor: 2,
  },
];

export const getNonAdjacentRooms = (
  rooms: Room[],
  foundRooms: Room[]
): string[] => {
  const rooms1 = getNonAdjancentRoom(rooms, foundRooms).map((s) => s.roomName);
  const rooms2 = getNonAdjancentRoom(rooms, foundRooms).map((s) => s.roomName);
  const rooms3 = getNonAdjancentRoom(rooms, foundRooms).map((s) => s.roomName);
  const rooms4 = getNonAdjancentRoom(rooms, foundRooms).map((s) => s.roomName);
  const grouped = [rooms1, rooms2, rooms3, rooms4];
  let groupedRoomsProper = ([] as string[]).concat(...grouped);

  if (groupedRoomsProper.includes("ART")) {
    if (groupedRoomsProper.includes("ARTB")) {
      groupedRoomsProper.filter((s) => s !== "ARTB");
      groupedRoomsProper = [
        ...groupedRoomsProper,
        getNonAdjancentRoom(rooms, foundRooms)
          .filter((s) => s.floor === 2)
          .map((s) => s.roomName)[0],
      ];
    }
  } else if (groupedRoomsProper.includes("ARTB")) {
    if (groupedRoomsProper.includes("ART")) {
      groupedRoomsProper.filter((s) => s !== "ART");
      groupedRoomsProper = [
        ...groupedRoomsProper,
        getNonAdjancentRoom(rooms, foundRooms)
          .filter((s) => s.floor === 2)
          .map((s) => s.roomName)[0],
      ];
    }
  }

  return groupedRoomsProper;
};

const getNonAdjancentRoom = (rooms: Room[], foundRooms: Room[]): Room[] => {
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
    Math.abs(room1.left - room2.left) <= 50 &&
    Math.abs(room1.top - room2.top) <= 30 &&
    room1.floor === room2.floor
  );
};
