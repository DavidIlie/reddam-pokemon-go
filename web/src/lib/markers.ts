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
  previousRooms: Room[] = []
): Room[] => {
  let nonAdjacentRooms: Room[] = [];
  let availableRooms = rooms.filter(
    (room) => !previousRooms.find((r) => r.roomName === room.roomName)
  );

  for (let i = 0; i < availableRooms.length; i++) {
    let randomIndex = Math.floor(Math.random() * availableRooms.length);
    let tempRoom = availableRooms[i];
    availableRooms[i] = availableRooms[randomIndex];
    availableRooms[randomIndex] = tempRoom;
  }

  availableRooms.forEach((room) => {
    let f1Count = 0;
    let f2Count = 0;
    nonAdjacentRooms.forEach((nonRoom) => {
      if (nonRoom.floor === 1) {
        f1Count += 1;
      } else if (nonRoom.floor === 2) {
        f2Count += 1;
      }
    });
    if (
      (f1Count < 3 && room.floor === 1) ||
      (f2Count < 3 && room.floor === 2)
    ) {
      let isAdjacent = false;
      nonAdjacentRooms.forEach((nonRoom) => {
        const xDiff = Math.abs(room.left - nonRoom.left);
        const yDiff = Math.abs(room.top - nonRoom.top);
        if (
          (xDiff <= 30 && yDiff <= 50) ||
          (xDiff <= 25 && yDiff <= 80) ||
          (xDiff <= 70 && yDiff <= 44)
        ) {
          isAdjacent = true;
        }
      });
      if (!isAdjacent) {
        nonAdjacentRooms.push(room);
      }
    }
  });

  return nonAdjacentRooms.slice(0, 6);
};
