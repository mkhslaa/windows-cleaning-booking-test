# Windows Cleaning Booking - Test Framework
https://github.com/mkhslaa/windows-cleaning-booking-test.git

## Summary
This is a NodeJS TypeScript framework that uses Vitest to test Window Cleaning system. 
It reads two JSON data files, `customers` and `customer-booking`, and processes them to answer two business questions: 
1. Give me total quantities of windows cleaned, filtered by date, name or both.
2. Give me  total cost of windows cleaning for a specififed booking number.

## TypeScript Framework Setup
It needs node version Node 20.19+ or 22.12 because of Vitest
- `nvm install –-lts`
- `nvm use --lts`
- `node -v`
- go to folder where you have done 
$git clone https://github.com/mkhslaa/windows-cleaning-booking-test.git
- `$npm install`: will install typescript, @types/node, tsx, vitest


## Compiling to typescript
npm run build
npm run typecheck

## Running the test
npm run start # run javascript code
npx vitest run src/windowCleaningBooking.spec.ts
npx vites # run all tests
npm run test # run all tests

## Test Data
There are two JSON files: `customers` and `customer-bookings`. They are joined with customer_number.

## Requirements
- `Feature-1`: total windows to be cleaned on a particular date. It can also be filtered by name or both date and name.
- `Feature-2`: cost of windows cleaning for a given booking number, £5 per property plus £1 per window.

## Assumptions
- enter date format to be YYY-MM-DD
- enter exact name or case-sensitive
- each property has a booking number. Cost = £5 per property plus (£1 per window * no of windows)

## Implentation
A spec file, `windowCleaningBooking.spec.ts`, has been developed, containing two functions: `getBookings` and `getBookingsCost` and many unit tests.

## Test Results
| Booking | Customer | Date       | Windows | Cost |
|--------:|----------|------------|--------:|-----:|
| 1       | George   | 2025-10-01 | 4       | £9   |
| 2       | Paul     | 2026-01-10 | 5       | £10  |
| 3       | John     | 2025-10-01 | 10      | £15  |
| 4       | Ringo    | 2025-10-01 | 12      | £17  |
For example, On date 2025-10-01 there are 3 bookings, 26 windows, cost £41

## Test Coverage
- Feature 1: Calculate total number of windows for a specific date, name or both
For example, a test checks that the date 2025-10-01 has 26 windows
- Feature 2: Calculate cost per booking number. For example, a test checks that the booking number 3 has cost £15
- Filtering: both positive and negative tests have been done. For example, case-sensitive name, both date and name, only date, only exact name return the correct quantities of windows. Invalid date should not return any match.
- Extra Testing: cost by date (£41) and cost by name (£17) have also been tested

## Further Improvements
- Feature 2 coverage is low. More tests could be added. For example, unknown booking number.
- There are some duplicate code. For example, calculating windows quantity inside every test. A helper function could be develooed to solve this.
- Make the code more modular. For example, move functions to separate module files.

