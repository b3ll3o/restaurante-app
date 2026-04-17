import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { LOCALE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat(LOCALE.ptBR, {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove múltiplos hífens
    .replace(/^-+|-+$/g, ''); // Remove hífens do início/fim
}

export function isValidWhatsApp(phone: string): boolean {
  // Remove tudo que não é número
  const cleaned = phone.replace(/\D/g, '');
  
  // Valida formato brasileiro: DDI + DDD + número
  // Exemplos válidos: 5511999999999, 11999999999
  return cleaned.length >= 10 && cleaned.length <= 13;
}

export function isValidPrice(price: number): boolean {
  return price > 0;
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}