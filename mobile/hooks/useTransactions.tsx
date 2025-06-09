import { View, Text, Alert } from "react-native";
import React, { useCallback, useEffect } from "react";
import { useState } from "react";

const API_URL = "http://192.168.0.145:3000/api";

export const useTransactions = (userId: string | undefined) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    income: 0,
    expense: 0
  });

  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      console.log("No userId provided");
      return;
    }

    try {
      console.log("Fetching transactions for userId:", userId);
      console.log("API URL:", `${API_URL}/transactions/${userId}`);

      const response = await fetch(`${API_URL}/transactions/${userId}`);
      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Transactions data:", data);
      setTransactions(data);
    } catch (error) {
      console.log("Failed to fetch transactions");
      console.error("Error fetching transactions:", error);
      setTransactions([]);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    if (!userId) {
      console.log("No userId provided for summary");
      return;
    }

    try {
      console.log("Fetching summary for userId:", userId);
      console.log(
        "Summary API URL:",
        `${API_URL}/transactions/summary/${userId}`
      );

      const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
      console.log("Summary response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Summary data:", data);
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary({ total: 0, income: 0, expense: 0 });
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) {
      console.log("No userId provided for loadData");
      return;
    }

    setLoading(true);
    try {
      console.log("Loading data for userId:", userId);
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  const deleteTransaction = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
          method: "DELETE"
        });
        if (!response.ok) {
          throw new Error("Failed to delete transaction");
        }
        await loadData();
        Alert.alert("Success", "Transaction deleted successfully");
      } catch (error) {
        console.error("Error deleting transaction:", error);
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "An unknown error occurred");
        }
      }
    },
    [loadData]
  );

  const addTransaction = useCallback(
    async (transaction: any) => {
      try {
        const response = await fetch(`${API_URL}/transactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(transaction)
        });
        if (!response.ok) {
          throw new Error("Failed to add transaction");
        }
        await loadData();
        Alert.alert("Success", "Transaction added successfully");
      } catch (error) {
        console.error("Error adding transaction:", error);
        if (error instanceof Error) {
          Alert.alert("Error", error.message);
        } else {
          Alert.alert("Error", "An unknown error occurred");
        }
      }
    },
    [loadData]
  );

  // FIXED: Remove loadData from dependency array to prevent infinite loop
  useEffect(() => {
    if (userId) {
      console.log("useEffect triggered with userId:", userId);
      loadData();
    } else {
      console.log("useEffect: No userId provided");
    }
  }, [userId]); // Only depend on userId, not loadData

  return {
    transactions,
    summary,
    loading,
    addTransaction,
    deleteTransaction,
    loadData
  };
};
