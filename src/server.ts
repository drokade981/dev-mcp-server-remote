import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { serve } from '@hono/node-server';
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { StreamableHTTPTransport } from '@hono/mcp';
import { GetPromptResult, ReadResourceResult } from "@modelcontextprotocol/sdk/types";
import { Hono } from "hono";

import { z } from "zod";


const NWS_API_BASE = "https://api.weather.gov";
const USER_AGENT = "weather-app/1.0";

const server = new McpServer({
    name: "Dev-MCP",
    version: "1.0.0",
});

server.registerResource(
    'refund-policy',
    'https://example.com/refund-policy',
    {
        title: 'Refund Policy',
        mimeType: 'text/plain',
        description: 'This is the refund policy for the website'
    },
    async (): Promise<ReadResourceResult> => ({
        contents: [{
            uri: "https://example.com/refund-policy",
            text: `Refund Policy

Last Updated: October 2026

At Dev-MCP, our goal is to provide high-quality learning resources, developer tools, and training programs that help professionals grow their technical skills. We encourage users to review available course information, demos, and previews before making a purchase.
To ensure fairness for both our learners and our platform, the following refund policy applies to all eligible purchases.
1. Refund Eligibility
You may request a refund for an eligible course, membership, or digital product if all of the following conditions are met:
✅ Request Submitted Within 7 Days
Refund requests must be submitted within 7 calendar days of the original purchase date.
✅ Limited Course Consumption
The purchased content must not have been substantially consumed. Generally, refunds are available only when a learner has accessed a limited portion of the paid content (approximately less than 20% of the course or equivalent usage).
✅ Genuine Purchase
The purchase must have been made through an authorized payment method and associated with a valid user account.
If these requirements are not satisfied, the purchase may not qualify for a refund.
2. Before You Purchase
We believe informed decisions lead to better learning outcomes. To help you evaluate whether a course or membership is right for you, Dev-MCP may provide:
Course outlines and learning objectives
Sample lessons or preview content
Technology stack and prerequisite details
Instructor information and teaching approach
Project and curriculum breakdowns

We strongly recommend reviewing these materials before making a purchase.
3. Non-Refundable Situations
Refunds generally will not be issued in the following circumstances:
Change of mind after extensive course usage
Lack of time to complete the course
Personal schedule conflicts
Failure to meet course prerequisites
Dissatisfaction with topics that were clearly described before purchase
Requests submitted after the eligibility period
Membership cancellations after significant use of platform resources
4. Billing or Payment Issues
If you experience any payment-related issues, such as:
Duplicate transactions
Incorrect charges
Failed enrollments despite successful payment
Technical payment processing errors
Please contact our support team immediately. Verified billing errors will be reviewed separately and corrected as appropriate.
5. Refund Processing
Once a refund request is approved:
Access to the purchased course, membership, or digital resource may be revoked.
The refund will be initiated through the original payment method.
Processing times vary depending on banks and payment providers.
Most refunds are completed within 5–10 business days, although timelines may differ based on your payment service.
6. Abuse Prevention
To protect the integrity of our platform and community, Dev-MCP reserves the right to deny refund requests involving:
Fraudulent transactions
Chargeback abuse
Excessive refund requests
Account sharing violations
Unauthorized access attempts
Any activity that violates our Terms of Service
Accounts found engaging in misuse may be suspended or terminated.
7. Subscription and Membership Plans
For recurring subscriptions:
Cancellation stops future billing cycles.
Previously billed subscription periods are generally non-refundable unless required by applicable law.
Access continues until the end of the active subscription period unless otherwise stated.
8. Policy Updates
Dev-MCP may update this Refund Policy from time to time to improve transparency and compliance. Any updates will be published on this page with a revised "Last Updated" date.
9. Contact Us
If you have questions regarding refunds, billing, or eligibility, please contact us:
Dev-MCP Support
 📧 support@dev-mcp.com
 🌐 https://dev-mcp.com
We are committed to resolving concerns fairly and providing an excellent learning experience for our developer community.
Dev-MCP's mission is to help developers learn with confidence. That's why we strive to provide transparent course information, accessible previews where available, and a fair refund process for eligible purchases.`
        }]
    })
);

server.registerPrompt("greeting-example", {
    title: "Greeting Template",
    description: "A simple greeting prompt template",
    argsSchema: {
        name: z
            .string()
            .describe("The name of the person to greet"),
    }
},
    async ({ name }): Promise<GetPromptResult> => {
        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: "text",
                        text: `Please greet ${name}! in a friendly manner and say hola everytime.`,
                    }
                },
            ],
        };
    }
);

server.registerPrompt("student_list", {
    title: "Student List Template",
    description: "A simple template to get a list of students",
    argsSchema: {
        limit: z
            .string()
            .describe("The number of student"),
    }
},
    async ({ limit }): Promise<GetPromptResult> => {
        return {
            messages: [
                {
                    role: 'user',
                    content: {
                        type: "text",
                        text: `give me the list of ${limit} students in LMS`,
                    }
                },
            ],
        };
    }
);

server.registerTool(
  "get_all_students",
  {
    description:
      "Get list of all students with their enrollment information.",
    inputSchema: {
      limit: z
        .number()
        .optional()
        .describe("Maximum number of students to return."),
    },
  },
  async ({ limit }) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];
    const lastWeek = new Date(Date.now() - 7 * 86400000)
      .toISOString()
      .split("T")[0];
    const lastMonth = new Date(Date.now() - 30 * 86400000)
      .toISOString()
      .split("T")[0];

    const students = [
      {
        id: "STU001",
        name: "Rahul Sharma",
        email: "rahul.sharma@gmail.com",
        joinedAt: lastMonth,
      },
      {
        id: "STU002",
        name: "Priya Patel",
        email: "priya.patel@gmail.com",
        joinedAt: lastMonth,
      },
      {
        id: "STU003",
        name: "Amit Kumar",
        email: "amit.kumar@gmail.com",
        joinedAt: lastWeek,
      },
      {
        id: "STU004",
        name: "Sneha Gupta",
        email: "sneha.gupta@gmail.com",
        joinedAt: lastWeek,
      },
      {
        id: "STU005",
        name: "Vikram Singh",
        email: "vikram.singh@gmail.com",
        joinedAt: yesterday,
      },
      {
        id: "STU006",
        name: "Anjali Verma",
        email: "anjali.verma@gmail.com",
        joinedAt: yesterday,
      },
      {
        id: "STU007",
        name: "Rohan Desai",
        email: "rohan.desai@gmail.com",
        joinedAt: today,
      },
      {
        id: "STU008",
        name: "Kavita Reddy",
        email: "kavita.reddy@gmail.com",
        joinedAt: today,
      },
      {
        id: "STU009",
        name: "Arjun Nair",
        email: "arjun.nair@gmail.com",
        joinedAt: today,
      },
      {
        id: "STU010",
        name: "Meera Joshi",
        email: "meera.joshi@gmail.com",
        joinedAt: lastWeek,
      },
      {
        id: "STU011",
        name: "Sanjay Mishra",
        email: "sanjay.mishra@gmail.com",
        joinedAt: lastMonth,
      },
      {
        id: "STU012",
        name: "Divya Saxena",
        email: "divya.saxena@gmail.com",
        joinedAt: today,
      },
    ];

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(students.slice(0, limit)),
        },
      ],
    };
  }
);

function main() {
    const app = new Hono();
   const transport = new StreamableHTTPTransport();

    app.all("/mcp", async (c) => {
        // console.log(await c.res.json());
        if(!server.isConnected()) {
            await server.connect(transport);
        }
        return transport.handleRequest(c);
    });
    serve({
        fetch: app.fetch,
        port: 3000
    });
}

main();