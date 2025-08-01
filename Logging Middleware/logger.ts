// logger.ts

// This is the access token you just received.
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMmJxMWE0NzIwQHZ2aXQubmV0IiwiZXhwIjoxNzU0MDI2MTczLCJpYXQiOjE3NTQwMjUyNzMsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIxZmVhYWQwYy1mYjlhLTRmMDUtODBhOC04YTcyNDJiOTAzMzkiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJjaGlubmFwYXJlZGR5IHZlbmthdGEga2FydGhpayByZWRkeSIsInN1YiI6ImI2OWJlNjJhLTk5NDItNGI3NS1hODJiLTdiOWQwYTZhZWZjZCJ9LCJlbWFpbCI6IjIyYnExYTQ3MjBAdnZpdC5uZXQiLCJuYW1lIjoiY2hpbm5hcGFyZWRkeSB2ZW5rYXRhIGthcnRoaWsgcmVkZHkiLCJyb2xsTm8iOiIyMmJxMWE0NzIwIiwiYWNjZXNzQ29kZSI6IlBuVkJGViIsImNsaWVudElEIjoiYjY5YmU2MmEtOTk0Mi00Yjc1LWE4MmItN2I5ZDBhNmFlZmNkIiwiY2xpZW50U2VjcmV0Ijoic3FGWVdqTkpCcnN3eWt4YiJ9.8T5_pK2vZQXUpGFLZ4MCyRIWO6tfKq-QfYSU9xbA8Z8";

// Define the allowed values for the log parameters
type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";
type LogStack = "frontend" | "backend";
type LogPackage = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";


/**
 * Sends a log message to the evaluation server.
 * @param stack The application stack (frontend or backend).
 * @param level The severity level of the log.
 * @param logPackage The part of the application where the log originates.
 * @param message The log message.
 */
export async function Log(stack: LogStack, level: LogLevel, logPackage: LogPackage, message: string): Promise<void> {
  const logApiUrl = 'http://20.244.56.144/evaluation-service/logs';

  try {
    const response = await fetch(logApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`, // Use the token here
      },
      body: JSON.stringify({
        stack,
        level,
        package: logPackage,
        message,
      }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log('Log created successfully:', result);
    } else {
      const errorText = await response.text();
      console.error('Failed to send log:', response.status, errorText);
    }
  } catch (error) {
    console.error('An error occurred while sending the log:', error);
  }
}

// Example of how to call this function from another file:
// import { Log } from './logger';
// Log('frontend', 'info', 'component', 'Application has started.');