import { View, Text, TouchableOpacity, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowDown,
  ArrowUp,
  Car,
  CheckIcon,
  MoreHorizontal,
  Receipt,
  ShoppingCart,
  Ticket,
  Utensils,
  Wallet
} from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { useTransactions } from "@/hooks/useTransactions";

const NewTrans = () => {
  const { user } = useUser();
  const { addTransaction } = useTransactions(user?.id);

  const [category, setCategory] = useState("expense");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    if (!title || !amount || !category) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      Alert.alert("Error", "Please enter a valid amount.");
      return;
    }

    const success = await addTransaction({
      title,
      amount: amountNumber,
      category,
      user_id: user?.id
    });

    if (success) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="px-3 mt-10 ">
        {/* header */}
        <View className="flex flex-row items-center justify-between pr-10">
          <Text className="text-2xl font-agile text-[#3b1d07a1]">
            New Transaction
          </Text>
          <TouchableOpacity
            onPress={handleSave}
            className="flex flex-row justify-center items-center gap-2 bg-[#8f4b1ba1] rounded-full px-4 py-2"
          >
            <Text className="text-xl text-white font-agile">Save</Text>
            <CheckIcon color="white" strokeWidth={4} size={20} />
          </TouchableOpacity>
        </View>

        {/* form */}
        <View className="mt-10 ">
          {/* Expense/Income Toggle */}
          <View className="flex-row justify-center p-1 bg-white rounded-full">
            {/* Expense */}
            <TouchableOpacity
              onPress={() => {
                setCategory("expense");
              }}
              className={`flex-1 p-3 rounded-full ${
                category === "expense" ? "bg-red-400" : ""
              }`}
            >
              <View className="flex-row items-center justify-center gap-x-2">
                <ArrowDown color={category === "expense" ? "white" : "black"} />
                <Text
                  className={`font-bold ${
                    category === "expense" ? "text-white" : "text-black"
                  }`}
                >
                  Expense
                </Text>
              </View>
            </TouchableOpacity>
            {/* Income */}
            <TouchableOpacity
              onPress={() => {
                setCategory("income");
              }}
              className={`flex-1 p-3 rounded-full ${
                category === "income" ? "bg-green-500" : ""
              }`}
            >
              <View className="flex-row items-center justify-center gap-x-2">
                <ArrowUp color={category === "income" ? "white" : "black"} />
                <Text
                  className={`font-bold ${
                    category === "income" ? "text-white" : "text-black"
                  }`}
                >
                  Income
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Amount Input */}
          <View className="items-center mt-6 bg-white rounded-lg">
            <TextInput
              placeholder="₹0.00"
              placeholderTextColor="gray"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
              }}
              className="text-6xl font-bold pt-4 text-[#3b1d07a1] "
            />
          </View>

          {/* Title Input */}
          <View className="mt-5">
            <TextInput
              placeholder="Transaction Title"
              placeholderTextColor="gray"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
              }}
              className="p-4 text-lg bg-white focus:border-[#3b1d07a1] border-[#3b1d07a1] rounded-lg"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NewTrans;
