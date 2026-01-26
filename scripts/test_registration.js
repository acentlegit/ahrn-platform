
async function testRegistration() {
    const payload = {
        name: "Test Org User",
        email: "testorg" + Math.random() + "@example.com",
        password: "password123",
        role: "TECHNICIAN",
        accountType: "B2B",
        companyInfo: {
            name: "Test Org Inc",
            registrationNumber: "12345",
            taxId: "TAX123"
        },
        skills: ["HVAC"]
    };

    console.log("Sending payload:", payload);

    try {
        const response = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Registration Response:", data);

    } catch (error) {
        console.error("Error:", error);
    }
}

testRegistration();
