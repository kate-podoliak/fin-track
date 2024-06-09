export function formatAmount(amount: number) {
    const amountString = amount.toString();
    return amountString.replace(/\.00/, "");
}