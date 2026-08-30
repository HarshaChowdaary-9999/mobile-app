import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { DataTable } from "react-native-paper";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import PaymentView from "@/components/paymentView";
const manageMonthCustomerView = () => {
  const { payments } = useLocalSearchParams();
  const { monthName, monthID, monthAmount, groupID, customerID } =
    useLocalSearchParams();
  const [customerName, setCustomerName] = useState();
  console.log("customer name in manage monthcustomer View", customerName);

  const payments1 = JSON.parse(payments);
  const [paymentFlag, setPaymentFlag] = useState(false);
  console.log(payments1);

  //shelved this currently
  useEffect(() => {
    const fetchingData = async () => {
      try {
        const fetchedData = await fetch(
          `http://localhost:4000/customer/customerStatsMonthly/${customerID}/${monthID}`
        );
        if (fetchedData.ok) {
          const data = fetchedData.json();
          console.log("Payments", data["payments"]);
        }
      } catch (error) {
        console.log(
          "error at fetching data at manage month customer veiw",
          error
        );
      }
    };
  }, [customerID]);
  const onpressClose = () => {
    setPaymentFlag(!paymentFlag);
  };
  return (
    <ScrollView>
      <View>
        <View>
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
              <Text style={styles.contentHeader}>Paid Amount :</Text>
              <Text style={styles.contentdata}>
                {payments1.reduce((sum, d) => sum + d.amount, 0)}
              </Text>
            </View>
            <View style={[styles.contentView, { backgroundColor: "white" }]}>
              <Text style={styles.contentHeader}>Balance Amount :</Text>
              <Text style={styles.contentdata}>
                {monthAmount - payments1.reduce((sum, d) => sum + d.amount, 0)}
              </Text>
            </View>
          </View>
          <View>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Name</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Amount</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Date</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Paid To</Text>
                </DataTable.Title>
                <DataTable.Title>
                  <Text style={styles.tableTitle}>Through</Text>
                </DataTable.Title>
              </DataTable.Header>
              {payments1 &&
                payments1.map((payment) => (
                  <DataTable.Row key={payment._id}>
                    <DataTable.Cell>{payment.customerName}</DataTable.Cell>
                    <DataTable.Cell>{payment.amount}</DataTable.Cell>
                    <DataTable.Cell>{payment.date}</DataTable.Cell>
                    <DataTable.Cell>{payment.paidToCustomer}</DataTable.Cell>
                    <DataTable.Cell>{payment.paymentMethod}</DataTable.Cell>
                  </DataTable.Row>
                ))}
            </DataTable>
          </View>

          <View style={styles.paymentBlock}>
            {paymentFlag && (
              <PaymentView
                groupID={groupID}
                onPress={onpressClose}
                monthID={monthID}
                customerID={customerID}
                customerName={
                  payments1[0]?.customerName ? payments1[0].customerName : ""
                }
              />
            )}
          </View>

          {!paymentFlag && (
            <TouchableOpacity onPress={() => setPaymentFlag((prev) => !prev)}>
              <View style={styles.button}>
                <Text style={[styles.title, { padding: 10 }]}>
                  <>
                    <FontAwesome6 name="plus" size="20" />
                    Payment
                  </>
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
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
});

export default manageMonthCustomerView;
