import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Dropdown } from "react-native-element-dropdown";

const paymentView = ({
  groupID,
  onPress,
  monthID,
  customerID,
  customerName,
}) => {
  console.log("groupID in paymentView: ", groupID, customerName);

  const [customerListData1, setCustomerListData1] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [paidToCustomer, setPaidToCustomer] = useState("");
  const [paidToCustomerId, setPaidToCustomerId] = useState("");
  const [sentAmount, setSentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const handleDone = async () => {
    console.log(sentAmount);
    console.log(paymentMethod);
    try {
      const sendData = await fetch(`http://localhost:4000/payment/addPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerID: customerID,
          groupID: groupID,
          customerName: customerName,
          paidToCustomer: paidToCustomer,
          monthID: monthID,
          paidTo: paidToCustomerId,
          amount: sentAmount,
          paymentMethod: paymentMethod,
        }),
      });
      console.log(sendData);

      if (sendData.ok) {
        console.log("success data was sent");
        setPaidToCustomer("");
        setPaidToCustomerId("");
        setPaymentMethod("");
      } else {
        console.log("Error at sending data");
      }
    } catch (error) {
      console.log("Error at sending payment Data ", error);
    }
  };

  useEffect(() => {
    const customerSearch = async () => {
      const customerList1 = await fetch(
        `http://localhost:4000/group//fetchCustomers/${groupID}`
      );
      const customerList = await fetch(
        "http://localhost:4000/customer/listCustomer"
      );

      if (customerList.ok) {
        const data = await customerList.json();
        const data1 = data["data"];

        setCustomerList(data1);
      }
      if (customerList1.ok) {
        const data = await customerList1.json();
        const data1 = data["data"];

        setCustomerListData1(data1["customers"]);
      }
    };
    customerSearch();
  }, []);
  return (
    <View>
      <View style={styles.paymentBlock}>
        <View style={styles.close}>
          <FontAwesome name="close" size={25} onPress={onPress} />
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputholder}>
            <Text style={styles.title}>Customer Name :</Text>

            <Text style={styles.inputField}>{customerName}</Text>
          </View>
          <View style={styles.inputholder}>
            <Text style={styles.title}>Amount :</Text>
            <TextInput style={styles.inputField} onChangeText={setSentAmount} />
          </View>
          <View style={styles.inputholder}>
            <Text style={styles.title}>Paid To :</Text>
            <Dropdown
              data={customerList}
              labelField="customerName"
              valueField="_id"
              placeholder="Paid To Customer"
              search
              searchPlaceholder="Search..."
              value={paidToCustomer}
              onChange={(item) => [
                setPaidToCustomer(item.customerName),
                setPaidToCustomerId(item._id),
              ]}
              style={styles.inputField}
            />
          </View>
          <View style={styles.inputholder}>
            <Text style={styles.title}>Payment Method</Text>
            <TextInput
              style={styles.inputField}
              onChangeText={setPaymentMethod}
            />
          </View>
        </View>
        <View>
          <TouchableOpacity style={styles.buttonDone} onPress={handleDone}>
            <Text style={styles.title}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  paymentBlock: {
    position: "absolute",
    top: "15%",
    width: "95%",
    marginHorizontal: 10,
    alignContent: "center",
    backgroundColor: "goldenrod",
    borderRadius: 10,
  },
  inputholder: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  inputField: {
    width: "60%",
    backgroundColor: "transparent",
    height: 40,
    color: "white",
    borderBottomWidth: 2,
    fontSize: 16,
    fontWeight: "bold",
    borderColor: "white",
  },
  inputContainer: {
    marginVertical: 30,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  close: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
  buttonDone: {
    backgroundColor: "green",
    borderRadius: 10,
    alignSelf: "flex-end",
    padding: 10,
    margin: 10,
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default paymentView;
