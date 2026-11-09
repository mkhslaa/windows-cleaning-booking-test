import customersData from "../data/customers.json" with { type: "json" };
import bookingsData from "../data/customer-bookings.json" with { type: "json" };
import { describe, it, expect } from "vitest";

const COST_PER_WINDOW = 1;
const COST_PER_PROPERTY = 5;

interface Customer {
  customer_number: string;
  name: string;
  Windows: string;
}

interface Booking {
  booking_number: string;
  customer_number: string;
  date: string;
}

interface BookingWithWindows extends Booking {
  name: string;
  windows: number;
}

const customers: Customer[] = customersData.customers;
const bookings: Booking[] = bookingsData.customer_bookings;

function getBookings(date?: string, name?: string): BookingWithWindows[] {
  const wantDate = date?.trim() || undefined;
  const wantName = name?.trim().toLowerCase() || undefined;

  return bookings
    .map((b) => {
      const customer = customers.find(
        (c) => c.customer_number === b.customer_number,
      );
      return {
        ...b,
        name: customer?.name ?? "Unknown",
        windows: Number(customer?.Windows ?? 0),
      };
    })
    .filter((r) => wantDate === undefined || r.date === wantDate)
    .filter((r) => wantName === undefined || r.name.toLowerCase() === wantName);
}

function getBookingsCost(booking_number: string): number {
  const booking = getBookings().find(
    (b) => b.booking_number === booking_number,
  );
  if (!booking) {
    throw new Error(`Booking with number ${booking_number} not found.`);
  }
  return COST_PER_PROPERTY + booking.windows * COST_PER_WINDOW;
}

describe("getBookings function", () => {
  it("should return bookings filtered by date", () => {
    const date = "2025-10-01";
    const results = getBookings(date);
    expect(results.every((r) => r.date === date)).toBe(true);
    expect(results.map((r) => r.booking_number)).toEqual(["1", "3", "4"]);
  });

  it("should return bookings filtered by name", () => {
    const name = "Ringo";
    const results = getBookings(undefined, name);
    expect(
      results.every((r) => r.name.toLowerCase() === name.toLowerCase()),
    ).toBe(true);
    expect(results.map((r) => r.booking_number)).toEqual(["4"]);
  });

  it("should return bookings filtered by both date and name", () => {
    const date = "2025-10-01";
    const name = "Ringo";
    const results = getBookings(date, name);
    expect(
      results.every(
        (r) => r.date === date && r.name.toLowerCase() === name.toLowerCase(),
      ),
    ).toBe(true);
    expect(results.map((r) => r.booking_number)).toEqual(["4"]);
  });

  it("should return all bookings if no filters are applied", () => {
    const results = getBookings();
    expect(results.length).toBe(bookings.length);
  });

  it("should return an empty array if no bookings match the filters", () => {
    const date = "2027-10-01";
    const name = "UnknownName";
    const results = getBookings(date, name);
    expect(results.length).toBe(0);
  });

  it("should handle case-insensitive name filtering", () => {
    const name = "rInGo";
    const results = getBookings(undefined, name);
    expect(
      results.every((r) => r.name.toLowerCase() === name.toLowerCase()),
    ).toBe(true);
    expect(results.map((r) => r.booking_number)).toEqual(["4"]);
  });

  it("should return an empty array if the date format is invalid", () => {
    const invalidDate = "251001";
    const results = getBookings(invalidDate);
    expect(results.length).toBe(0);
  });

  it("should return an empty array if the date is in the future and no bookings exist for that date", () => {
    const futureDate = "2100-01-01";
    const results = getBookings(futureDate);
    expect(results.length).toBe(0);
  });

  it("should return all bookings if both date and name are undefined", () => {
    const results = getBookings(undefined, undefined);
    expect(results.length).toBe(bookings.length);
  });

  it("should total the number of windows cleaned based on the filtered options both date and name", () => {
    // Feature 1
    const date = "2025-10-01";
    const name = "Ringo";
    const EXPECTED_TOTAL_WINDOWS = 12;
    const results = getBookings(date, name);
    const totalWindows = results.reduce(
      (sum, record) => sum + record.windows,
      0,
    );
    expect(totalWindows).toBe(EXPECTED_TOTAL_WINDOWS);
  });

  it("should total the number of windows cleaned based on the filtered option date only", () => {
    const date = "2025-10-01";
    const EXPECTED_TOTAL_WINDOWS = 26;
    const results = getBookings(date, undefined);
    const totalWindows = results.reduce(
      (sum, record) => sum + record.windows,
      0,
    );
    expect(totalWindows).toBe(EXPECTED_TOTAL_WINDOWS);
  });

  it("should total the cost of windows cleaned based on the filtered options both date and name", () => {
    const date = "2025-10-01";
    const name = "Ringo";

    const EXPECTED_TOTAL_COST = 17;
    const results = getBookings(date, name);
    const totalCost = results.reduce(
      (total, record) =>
        total + COST_PER_PROPERTY + record.windows * COST_PER_WINDOW,
      0,
    );
    console.log(`Total cost of windows cleaned: £${totalCost}`);
    expect(totalCost).toBe(EXPECTED_TOTAL_COST);
  });

  it("should total the cost of windows cleaned based on the filtered option date only", () => {
    const date = "2025-10-01";
    const EXPECTED_TOTAL_COST = 41;
    const results = getBookings(date, undefined);
    expect(results.map((r) => r.booking_number)).toEqual(["1", "3", "4"]);
    const totalCost = results.reduce(
      (total, record) =>
        total + COST_PER_PROPERTY + record.windows * COST_PER_WINDOW,
      0,
    );
    console.log(`Total cost of windows cleaned: £${totalCost}`);
    expect(totalCost).toBe(EXPECTED_TOTAL_COST);
  });

  it("should total the cost of windows cleaned based on the filtered option name only", () => {
    const name = "Ringo";
    const EXPECTED_TOTAL_COST = 17;
    const results = getBookings(undefined, name);
    expect(results.map((r) => r.booking_number)).toEqual(["4"]);
    const totalCost = results.reduce(
      (total, record) =>
        total + COST_PER_PROPERTY + record.windows * COST_PER_WINDOW,
      0,
    );
    console.log(`Total cost of windows cleaned: £${totalCost}`);
    expect(totalCost).toBe(EXPECTED_TOTAL_COST);
  });
});

describe("Feature 2: cost of a booking", () => {
  // Feature 2
  it("returns the correct cost for a known booking", () => {
    const bookingNumber = "3";
    const expectedCost = COST_PER_PROPERTY + 10 * COST_PER_WINDOW; // 5 + 10*1 = 15
    console.log(`Expected cost for booking ${bookingNumber}: £${expectedCost}`);
    expect(getBookingsCost(bookingNumber)).toBe(expectedCost);
  });
});
