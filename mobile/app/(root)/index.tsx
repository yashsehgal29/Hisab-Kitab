import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link, router } from "expo-router";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SignOutButton } from "@/components/SignOutButton";
import { useTransactions } from "@/hooks/useTransactions";
import { useEffect, useState, useCallback } from "react";
import SkeletonContent from "react-native-skeleton-content";
import { Image } from "react-native";
import { LogOut, Plus, Trash2 } from "lucide-react-native";
import Loading from "@/components/Loading";

export default function Page() {
  const { user } = useUser();
  const { transactions, summary, loading, deleteTransaction, loadData } =
    useTransactions(user?.id);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => {
      setRefreshing(false);
    });
  }, [loadData]);

  return (
    <SafeAreaView className="flex-1 ">
      <View className="flex-1 px-3 mt-8 ">
        {/* Header bar */}
        <View className="flex flex-row items-center justify-between w-full mt-5 bg-white rounded-2xl">
          <View className="flex-row items-center ">
            <View className="flex-row items-center ">
              <Image
                source={{
                  uri: "https://github.com/burakorkmez/wallet-app-assets/blob/master/logo.png?raw=true"
                }}
                className="w-[6rem] h-[5rem]"
              />
            </View>
            <View>
              <Text className="text-[#d46d24a1] font-agile">Welcome!!</Text>
              <Text className="text-md text-[#2b1201a1] font-agile">
                {user?.emailAddresses[0].emailAddress.replace(/@.*/, "")}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center ">
            <TouchableOpacity
              className="flex-row items-center gap-1 bg-[#8f4b1ba1] rounded-full px-5 py-3"
              onPress={() => router.push("/newTrans")}
            >
              <Text className="text-white font-agile">Add</Text>
              <Plus size={16} color="white" />
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>
        {/* Summary section */}
        <View className="w-full p-3 mt-5 bg-white rounded-2xl">
          <View className="flex flex-col items-start justify-center py-5 ">
            <Text className="text-xl text-gray-500">Total Balance: </Text>
            {loading ? (
              <Loading />
            ) : (
              <Text className="text-4xl font-agile">₹ {summary.total}</Text>
            )}
          </View>
          <View className="flex flex-row items-center justify-around">
            <View className="flex flex-col items-center justify-center px-5 py-3 rounded-xl gap-y-2">
              <Text className="text-center text-gray-400 font-agile">
                Income:{" "}
              </Text>
              <Text className="text-2xl text-center text-green-400 font-agile">
                {loading ? (
                  <Loading />
                ) : (
                  <Text className="text-2xl text-center text-green-400 font-agile">
                    +₹ {summary.income}
                  </Text>
                )}
              </Text>
            </View>
            <View className="flex flex-col items-center justify-center px-3 py-3 rounded-xl gap-y-2">
              <Text className="text-center text-gray-400 font-agile">
                Expense:{" "}
              </Text>
              <Text className="text-2xl text-center text-red-400 font-agile">
                {loading ? (
                  <Loading />
                ) : (
                  <Text className="text-2xl text-center text-red-400 font-agile">
                    -₹ {summary.expense}
                  </Text>
                )}
              </Text>
            </View>
          </View>

          <View></View>
        </View>
        <Text className="mt-5 text-xl text-[#2d190ca1] font-agile">
          Recent Transactions
        </Text>
        <ScrollView
          scrollEnabled={true}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#d46d24a1"]}
              progressBackgroundColor="#ffffff"
              tintColor="#d46d24a1"
            />
          }
        >
          {loading ? (
            <Loading />
          ) : (
            transactions.map((transaction) => (
              <View
                key={transaction.id}
                className="flex-row items-center justify-between p-3 mt-2 bg-white rounded-lg"
              >
                <View>
                  <Text className="font-bold">{transaction.title}</Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </Text>
                </View>
                <View className="flex-row items-center gap-x-6">
                  <Text
                    className={`font-bold ${
                      transaction.category === "income"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {transaction.category === "income" ? "+ " : "- "}₹{" "}
                    {transaction.amount}
                  </Text>
                  <TouchableOpacity
                    className="p-3 bg-red-500 rounded-full"
                    onPress={() => deleteTransaction(transaction.id)}
                  >
                    <Trash2 size={20} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
