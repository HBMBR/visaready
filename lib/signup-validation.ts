// Sign-up rules, shared by the form (checks before sending, shows the message
// next to the field) and /api/signup (checks again, since the browser can be
// bypassed). One copy, so the two can't drift apart.

import { COUNTRIES } from "@/lib/countries";
import { isValidRole } from "@/lib/roles";
import { isValidDestination } from "@/lib/destinations";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_RE = /^[+\d][\d\s\-()]{5,30}$/;

const VALID_NATIONALITY = new Set<string>([...COUNTRIES.map((c) => c.code), "OTHER"]);

export type SignupField =
  | "firstName"
  | "lastName"
  | "email"
  | "phone"
  | "nationality"
  | "desiredRole"
  | "destination"
  | "agreed";

export interface SignupInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  desiredRole: string;
  destination: string;
  agreed: boolean;
}

export const AGREE_MESSAGE = "Please tick the box to agree to the Terms, Privacy Policy and Disclaimer.";

/** First problem found, in the order the fields appear on the form; null if all good. */
export function validateSignup(raw: SignupInput): { field: SignupField; message: string } | null {
  const firstName = raw.firstName.trim();
  const lastName = raw.lastName.trim();
  const email = raw.email.trim().toLowerCase();
  const phone = raw.phone.trim();

  if (firstName.length < 2 || firstName.length > 60) {
    return { field: "firstName", message: "Please enter your first name." };
  }
  if (lastName.length < 2 || lastName.length > 60) {
    return { field: "lastName", message: "Please enter your surname." };
  }
  if (!EMAIL_RE.test(email) || email.length > 255) {
    return { field: "email", message: "Please enter a valid email address." };
  }
  if (phone && !PHONE_RE.test(phone)) {
    return { field: "phone", message: "That phone number doesn't look right. Leave it blank if you prefer." };
  }
  if (!VALID_NATIONALITY.has(raw.nationality)) {
    return { field: "nationality", message: "Please select your nationality." };
  }
  if (!isValidRole(raw.desiredRole)) {
    return { field: "desiredRole", message: "Please select a desired role." };
  }
  if (!isValidDestination(raw.destination)) {
    return { field: "destination", message: "Please choose where you'd like to work." };
  }
  if (raw.agreed !== true) {
    return { field: "agreed", message: AGREE_MESSAGE };
  }
  return null;
}
