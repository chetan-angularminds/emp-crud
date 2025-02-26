// Check if Intl.supportedValuesOf is available
if (Intl.supportedValuesOf) {
    const currencies = Intl.supportedValuesOf('currency');

    currencies.forEach(code => {
        const formatted = new Intl.NumberFormat('en', { style: 'currency', currency: code }).format(1);
        const symbol = formatted.replace(/\d|\s|\.|,/g, ''); // Extract symbol
        console.log(`${code}: ${symbol}`);
    });
} else {
    console.log("Intl.supportedValuesOf('currency') is not supported in this Node.js version.");
}
