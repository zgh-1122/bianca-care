
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      type,
      orderId,
      email,
      reasonOrCategory,
      details,
    } = body;

    // Check required fields
    if (
      !orderId?.trim() ||
      !email?.trim() ||
      !reasonOrCategory?.trim()
    ) {
      return NextResponse.json(
        {
          error: "Please fill out all required fields.",
        },
        { status: 400 }
      );
    }

    // Validate Order ID format only: BN-12345
    // No database existence check
    const orderIdPattern = /^BN-\d{5}$/;
    const cleanOrderId = orderId.trim();

    if (!orderIdPattern.test(cleanOrderId)) {
      return NextResponse.json(
        {
          error:
            "Invalid Order ID format. Please use BN-12345 format.",
        },
        { status: 400 }
      );
    }

    // Validate request type
    if (!["cancel", "complaint"].includes(type)) {
      return NextResponse.json(
        {
          error: "Invalid support request type.",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const cleanEmail = email.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(cleanEmail)) {
      return NextResponse.json(
        {
          error: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // Save cancellation or complaint request
    const supportTicket = await prisma.supportRequest.create({
      data: {
        type,
        orderId: cleanOrderId,
        email: cleanEmail,
        reasonOrCategory: reasonOrCategory.trim(),
        details: details?.trim() || "",
        status: "Pending",
      },
    });

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message:
          type === "cancel"
            ? "Your cancellation request has been submitted successfully."
            : "Your complaint has been submitted successfully.",
        ticketId: supportTicket.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Support API Error:", error);

    return NextResponse.json(
      {
        error:
          "Unable to submit your request right now. Please try again.",
      },
      { status: 500 }
    );
  }
}

