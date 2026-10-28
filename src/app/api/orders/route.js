
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      orderId,
      fullName,
      phone,
      address,
      city,
      paymentMethod,
      paymentDetail,
      totalAmount,
      cartItems,
    } = body;

    // Validate required fields
    if (
      !orderId ||
      !fullName ||
      !phone ||
      !address ||
      totalAmount == null ||
      !cartItems
    ) {
      return NextResponse.json(
        { error: 'Required order fields are missing.' },
        { status: 400 }
      );
    }

    // Validate amount
    const amount = Number(totalAmount);

    if (!Number.isFinite(amount) || amount < 0) {
      return NextResponse.json(
        { error: 'Invalid order amount.' },
        { status: 400 }
      );
    }

    // Save the customer's order ID in orderNumber
    const newOrder = await prisma.order.create({
      data: {
        orderNumber: String(orderId).trim(),
        fullName: String(fullName).trim(),
        phone: String(phone).trim(),
        address: String(address).trim(),
        city: city ? String(city).trim() : null,
        paymentMethod: paymentMethod || 'cod',
        paymentDetail: paymentDetail || null,
        totalAmount: amount,
        cartItems,
      },
    });

    return NextResponse.json(
      {
        message: 'Order placed successfully!',
        data: newOrder,
        orderId: newOrder.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Order API Error:', error);

    // Duplicate order number
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'This Order ID already exists. Please try placing the order again.',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Unable to place order. Please try again.' },
      { status: 500 }
    );
  }
}

