export function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

export function isValidNumber(number: string): boolean {
    const numberRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return numberRegex.test(number);
}

export function confirmPassword(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
}