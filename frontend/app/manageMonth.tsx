import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { DataTable, TextInput } from "react-native-paper";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Dropdown } from "react-native-element-dropdown";

const manageMonth = () => {
  const { groupID, monthID } = useLocalSearchParams();
  const [monthAmount, setMonthAmount] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState();
  const [monthName, setMonthName] = useState("");
  const [paymentSheet, setPaymentSheet] = useState([]);
  const [paymentFlag, setPaymentFlag] = useState(false);

  //payment requirements
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paidToCustomer, setPaidToCustomer] = useState("");
  const [paidToCustomerId, setPaidToCustomerId] = useState("");
  const [sentAmount, setSentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerListData1, setCustomerListData1] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const [checkCustomer, setCheckCustomer] = useState(false);

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
  }, [paymentFlag]);

  const sendingPaymentData = async () => {
    try {
      const sendData = await fetch(`http://localhost:4000/payment/addPayment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerID: customerId,
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
        setCustomerId("");
        setCustomerName("");
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
    const fetchMonthData = async () => {
      try {
        const data = await fetch(
          `http://localhost:4000/group/monthlyPayment/${monthID}`
        );
        console.log(data.ok);

        if (data.ok) {
          const data1 = await data.json();
          const fetchedData = data1["data"];
          console.log("Fetched data", fetchedData["amount"]);
          setMonthAmount(fetchedData["amount"]);
          setCollectedAmount(fetchedData["amountReceived"]);
          setMonthName(fetchedData["month"]);
          setPaymentSheet(fetchedData["paymentSheet"]);
        } else {
          console.log("couldn't fetch montly data");
        }
      } catch (error) {
        console.log("error at fetching monthly data", error);
      }
    };
    fetchMonthData();
  }, []);

  return (
    <ScrollView>
      <View>
        <View
          style={[
            { opacity: paymentFlag ? 0.3 : 1 },
            {
              marginBottom: 40,
            },
          ]}
        >
          <View style={{ width: "80%", marginLeft: 15 }}>
            <View style={[styles.contentView, { backgroundColor: "white" }]}>
              <Text style={styles.contentHeader}>MonthName : </Text>
              <Text style={styles.contentdata}>{monthName}</Text>
            </View>
            <View style={styles.contentView}>
              <Text style={styles.contentHeader}>Current Month Amount :</Text>
              <Text style={styles.contentdata}>{monthAmount}</Text>
            </View>
            <View style={[styles.contentView, { backgroundColor: "white" }]}>
              <Text style={styles.contentHeader}>Total Amount :</Text>
              <Text style={styles.contentdata}>{monthAmount * 20}</Text>
            </View>
            <View style={[styles.contentView]}>
              <Text style={styles.contentHeader}>Collected Amount :</Text>
              <Text style={styles.contentdata}>{collectedAmount}</Text>
            </View>
          </View>
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Name</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Total Amount</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Paid Amount</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Sent To</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>View</Text>
                </DataTable.Title>
              </DataTable.Header>
              {paymentSheet.map((payment) => (
                <DataTable.Row key={payment._id}>
                  <DataTable.Cell>{payment["customerName"]}</DataTable.Cell>
                  <DataTable.Cell>{monthAmount}</DataTable.Cell>
                  <DataTable.Cell>{payment["amount"]}</DataTable.Cell>
                  <DataTable.Cell>{payment["paidToCustomer"]}</DataTable.Cell>
                  <DataTable.Cell>
                    <Text>Temp</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        </View>
        {paymentFlag && (
          <View style={styles.paymentBlock}>
            <View style={styles.close}>
              <FontAwesome
                name="close"
                size={25}
                onPress={() => {
                  setPaymentFlag(!paymentFlag);
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.inputholder}>
                <Text style={styles.title}>Customer Name :</Text>
                <Dropdown
                  data={customerListData1}
                  labelField="customerName"
                  valueField="_id"
                  placeholder="Customer Name"
                  search
                  searchPlaceholder="Search..."
                  value={customerName}
                  onChange={(item) => [
                    setCustomerName(item.customerName),
                    setCustomerId(item._id),
                  ]}
                  style={styles.inputField}
                />
              </View>
              <View style={styles.inputholder}>
                <Text style={styles.title}>Amount :</Text>
                <TextInput style={styles.inputField} />
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
                <TextInput style={styles.inputField} />
              </View>
            </View>
          </View>
        )}
        <TouchableOpacity
          onPress={
            paymentFlag
              ? sendingPaymentData
              : () => {
                  setPaymentFlag(!paymentFlag);
                }
          }
        >
          <View style={styles.button}>
            <Text style={[styles.title, { padding: 10 }]}>
              {paymentFlag ? (
                "Done"
              ) : (
                <>
                  <FontAwesome6 name="plus" size="20" />
                  Payment
                </>
              )}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  contentHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
  contentdata: {
    fontSize: 17,
    fontWeight: "semibold",
  },
  tableTitle: {
    fontWeight: "bold",
    fontSize: 13,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  button: {
    backgroundColor: "goldenrod",
    borderRadius: 10,
    alignSelf: "flex-start",
    position: "absolute",
    right: 5,
  },
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
    height: 30,
  },
  inputContainer: {
    marginVertical: 30,
  },
  close: {
    position: "absolute",
    right: 0,
    padding: 10,
  },
});

export default manageMonth;
