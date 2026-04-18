import { auth } from "@/libs/auth";
import db from "@/libs/db";

const TIME_SLOT_DATA = [
  { number: 1, startTime: "07:00", endTime: "07:50" },
  { number: 2, startTime: "07:50", endTime: "08:40" },
  { number: 3, startTime: "08:40", endTime: "09:30" },
  { number: 4, startTime: "09:40", endTime: "10:30" },
  { number: 5, startTime: "10:30", endTime: "11:20" },
  { number: 6, startTime: "11:20", endTime: "12:10" },
  { number: 7, startTime: "12:50", endTime: "13:40" },
  { number: 8, startTime: "13:40", endTime: "14:30" },
  { number: 9, startTime: "14:30", endTime: "15:20" },
  { number: 10, startTime: "15:20", endTime: "16:20" },
  { number: 11, startTime: "16:20", endTime: "17:10" },
  { number: 12, startTime: "17:10", endTime: "18:00" },
];

function parseTimeStr(timeStr: string) {
  return new Date(`1970-01-01T${timeStr}:00.000Z`);
}

async function main() {
  const seedUser = {
    name: "Hachimichi Mambo",
    email: "admin@example.com",
    password: "password",
  };

  const existingUser = await db.user.findUnique({
    where: { email: seedUser.email },
  });

  if (!existingUser) {
    await auth.api.signUpEmail({
      body: {
        name: seedUser.name,
        email: seedUser.email,
        password: seedUser.password,
      },
    });
    console.log("User created.");
  } else {
    console.log("Skipping user creation.");
  }

  const existingTimeslotCount = await db.timeslot.count();

  if (existingTimeslotCount === 0) {
    const timeslotsToInsert = TIME_SLOT_DATA.map((slot) => ({
      slotNumber: slot.number,
      startTime: parseTimeStr(slot.startTime),
      endTime: parseTimeStr(slot.endTime),
    }));

    const result = await db.timeslot.createMany({
      data: timeslotsToInsert,
    });

    console.log(`Created ${result.count} timeslots.`);
  } else {
    console.log("Skipping timeslot creation.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
