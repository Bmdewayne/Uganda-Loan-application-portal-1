export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const {
      name,
      phone,
      email,
      location,
      amount,
      term,
      purpose,
      income,
      additionalInformation
    } = req.body;

    if (!name || !phone || !amount || !term || !purpose) {
      return res.status(400).json({
        error: "Required information is missing"
      });
    }

    const message = `
📝 NEW LOAN APPLICATION

👤 Name: ${name}
📱 Phone: ${phone}
📧 Email: ${email || "Not provided"}
📍 Location: ${location || "Not provided"}

💰 Loan Amount: UGX ${Number(amount).toLocaleString()}
📅 Term: ${term}
🎯 Purpose: ${purpose}
💵 Monthly Income: ${
      income
        ? "UGX " + Number(income).toLocaleString()
        : "Not provided"
    }

📄 Additional Information:
${additionalInformation || "None"}
`;

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: process.env.TELEGRAM_CHAT_ID,
          text: message
        })
      }
    );

    const telegramData = await telegramResponse.json();

    if (!telegramResponse.ok || !telegramData.ok) {
      return res.status(500).json({
        error: "Could not send application"
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error"
    });
  }
      }
