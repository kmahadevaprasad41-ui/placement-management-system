import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { saveFirestoreDoc, getFirestoreDoc, setRealtimeDbData } from "@/lib/firebase-db";

export async function POST(req: Request) {
  try {
    const timestamp = new Date().toISOString();
    const testPayload = {
      status: "ONLINE",
      service: "Placement Management System",
      projectId: "placement-management-sys-3afa6",
      testedAt: timestamp,
      sampleStats: {
        totalStudents: 52,
        activeDrives: 3,
        highestCTC: "₹32.5 LPA",
      },
    };

    // 1. Write ping to Cloud Firestore
    const firestoreResult = await saveFirestoreDoc("system_health", "pms_connection_test", testPayload);

    // 2. Write ping to Realtime Database
    const rtdbResult = await setRealtimeDbData("system_health/live_ping", {
      ...testPayload,
      pingTimestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Firebase Database!",
      projectId: "placement-management-sys-3afa6",
      firestore: firestoreResult,
      realtimeDb: rtdbResult,
      timestamp,
    });
  } catch (error: any) {
    console.error("Firebase connection test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to connect to Firebase database",
      },
      { status: 500 }
    );
  }
}
