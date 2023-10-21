export function isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email) || email.length === 0;
}

export function isValidNumber(number: string): boolean {
    const numberRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
    return numberRegex.test(number) || number.length === 0;
}

export function matchingPassword(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
}

export function isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.{8,})(?=\D*\d)(?=[^A-Z]*[A-Z])(?=\w*\W)/;
    return passwordRegex.test(password) || password.length === 0;
}

export function isValidVIN(vin: string): boolean {
    const vinRegex = /^(RL[0,4,A,C,E,H,L,M,V]|RP8)[A-HJ-NPR-Z0-9]{14}$/;
    return vinRegex.test(vin) || vin.length === 0;
}