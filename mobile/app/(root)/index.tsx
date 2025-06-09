import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { SafeAreaView, Text, View } from "react-native";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect } from "react";
export default function Page() {
  const { user } = useUser();
  const {
    transactions,
    summary,
    loading,
    addTransaction,
    deleteTransaction,
    loadData
  } = useTransactions(user?.id);

  return (
    <SafeAreaView className="items-center justify-center flex-1 ">
      <View className="items-center justify-center flex-1">
        {user ? (
          <View className="flex items-center justify-center">
            <Text>Hello {user.emailAddresses[0].emailAddress}</Text>
            <Text>Total: {summary.total}</Text>
            <Text>Income: {summary.income}</Text>
            <Text>Expense: {summary.expense}</Text>
          </View>
        ) : (
          <Text>Loading...</Text>
        )}
        <SignOutButton />
      </View>
    </SafeAreaView>
  );
}
