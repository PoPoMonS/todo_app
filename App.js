import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	TouchableWithoutFeedback,
	TextInput,
	ScrollView,
	Alert,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";

const STORAGE_KEY = "@toDos";

export default function App() {
	const [working, setWorking] = useState(true);
	const [text, setText] = useState("");
	const [toDos, setToDos] = useState({});
	const travel = () => {
		setWorking(false);
	};
	const work = () => {
		setWorking(true);
	};
	const onChangeText = (payload) => {
		setText(payload);
	};
	const saveToDos = async (toSave) => {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
	};
	const loadToDos = async () => {
		const s = await AsyncStorage.getItem(STORAGE_KEY);
		setToDos(JSON.parse(s));
	};
	useEffect(() => {
		loadToDos();
	}, []);
	const addToDo = async () => {
		if (text === "") {
			return;
		}
		// const newToDos = Object.assign({}, toDos, {
		// 	[Date.now()]: { text, work: working },
		// });
		const newToDos = { ...toDos, [Date.now()]: { text, working } };
		setToDos(newToDos);
		await saveToDos(newToDos);
		setText("");
	};
	const deleteToDo = (key) => {
		Alert.alert("Delete", "Sure?", [
			{ text: "Cancel" },
			{
				text: "Confirm",
				onPress: async () => {
					const newToDos = { ...toDos };
					delete newToDos[key];
					setToDos(newToDos);
					await saveToDos(newToDos);
				},
				style: "destructive",
			},
		]);
		return;
	};
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<View style={styles.header}>
				<TouchableOpacity onPress={work}>
					<Text
						style={{ ...styles.btnText, color: working ? "ivory" : theme.grey }}
					>
						Work
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={travel}>
					<Text
						style={{
							...styles.btnText,
							color: !working ? "ivory" : theme.grey,
						}}
					>
						Travel
					</Text>
				</TouchableOpacity>
			</View>
			<TextInput
				onChangeText={onChangeText}
				onSubmitEditing={addToDo}
				returnKeyType="done"
				value={text}
				placeholder={working ? "Add what to do" : "Where do you want to go"}
				style={styles.input}
			></TextInput>
			<ScrollView>
				{Object.keys(toDos).map((key) =>
					toDos[key].working === working ? (
						<View style={styles.toDo} key={key}>
							<Text style={styles.toDoText}>{toDos[key].text}</Text>
							<TouchableOpacity
								onPress={() => {
									deleteToDo(key);
								}}
							>
								<Fontisto name="trash" size={18} color="ivory" />
							</TouchableOpacity>
						</View>
					) : null
				)}
			</ScrollView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.bg,
		paddingHorizontal: 20,
	},
	header: {
		justifyContent: "space-between",
		flexDirection: "row",
		marginTop: 100,
	},
	btnText: {
		fontSize: 40,
		fontWeight: "500",
	},
	input: {
		backgroundColor: "ivory",
		paddingHorizontal: 15,
		paddingVertical: 20,
		borderRadius: 30,
		marginVertical: 20,
		fontSize: 18,
	},
	toDo: {
		backgroundColor: theme.grey,
		marginBottom: 10,
		borderRadius: 15,
		paddingHorizontal: 20,
		paddingVertical: 20,
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	toDoText: {
		color: "ivory",
		fontSize: 20,
	},
});
