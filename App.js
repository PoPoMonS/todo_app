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
	Platform,
} from "react-native";
import { theme } from "./colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const STORAGE_KEY_MENUTYPE = "@menuType";
const STORAGE_KEY_TODO = "@toDos";

const WORK = 0;
const SEHYUN = 1;
const TRAVEL = 2;

export default function App() {
	const [menuType, setMenuType] = useState(WORK);
	const [textInput, setTextInput] = useState("");
	const [textEdit, setTextEdit] = useState("");
	const [toDos, setToDos] = useState({});

	useEffect(() => {
		loadToDos();
		loadMenuType();
	}, []);

	const travel = () => {
		setMenuType(TRAVEL);
		saveMenuType(TRAVEL);
	};
	const work = () => {
		setMenuType(WORK);
		saveMenuType(WORK);
	};
	const sehyun = () => {
		setMenuType(SEHYUN);
		saveMenuType(SEHYUN);
	};
	const saveMenuType = async (toSave) => {
		await AsyncStorage.setItem(STORAGE_KEY_MENUTYPE, JSON.stringify(toSave));
	};
	const loadMenuType = async () => {
		const s = await AsyncStorage.getItem(STORAGE_KEY_MENUTYPE);
		setMenuType(JSON.parse(s));
	};
	const onChangeTextInput = (payload) => {
		setTextInput(payload);
	};
	const saveToDos = async (toSave) => {
		await AsyncStorage.setItem(STORAGE_KEY_TODO, JSON.stringify(toSave));
	};
	const loadToDos = async () => {
		const s = await AsyncStorage.getItem(STORAGE_KEY_TODO);
		if (s === null) {
			return;
		}
		setToDos(JSON.parse(s));
	};
	const addToDo = async () => {
		if (textInput === "") {
			return;
		}
		// const newToDos = Object.assign({}, toDos, {
		// 	[Date.now()]: { text, work: working },
		// });
		const newToDos = {
			...toDos,
			[Date.now()]: { textInput, menuType, done: false, editing: false },
		};
		setToDos(newToDos);
		await saveToDos(newToDos);
		setTextInput("");
	};
	const deleteToDo = (key) => {
		if (Platform.OS === "web") {
			const ok = confirm("Do you want to delete this To Do?");
			if (ok) {
				const newToDos = { ...toDos };
				delete newToDos[key];
				setToDos(newToDos);
				await saveToDos(newToDos);
			}
		} else {
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
		}
	};
	const doneToDo = async (key) => {
		const newToDos = { ...toDos };
		if (newToDos[key].done === true) {
			newToDos[key].done = false;
		} else {
			newToDos[key].done = true;
		}
		setToDos(newToDos);
		await saveToDos(newToDos);
	};
	const editToDo = async (key) => {
		const newToDos = { ...toDos };
		if (newToDos[key].editing === true) {
			newToDos[key].editing = false;
			newToDos[key].textInput = textEdit;
			setToDos(newToDos);
			setTextEdit("");
		} else {
			newToDos[key].editing = true;
			setTextEdit(newToDos[key].textInput);
		}
		setToDos(newToDos);
		await saveToDos(newToDos);
	};
	const onChangeTextEdit = (payload) => {
		setTextEdit(payload);
	};
	return (
		<View style={styles.container}>
			<StatusBar style="auto" />
			<View style={styles.header}>
				<TouchableOpacity onPress={work}>
					<Text
						style={{
							...styles.btnText,
							color: menuType === WORK ? "ivory" : theme.grey,
						}}
					>
						Work
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={sehyun}>
					<Text
						style={{
							...styles.btnText,
							color: menuType === SEHYUN ? "ivory" : theme.grey,
						}}
					>
						세현
					</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={travel}>
					<Text
						style={{
							...styles.btnText,
							color: menuType === TRAVEL ? "ivory" : theme.grey,
						}}
					>
						Travel
					</Text>
				</TouchableOpacity>
			</View>
			<TextInput
				onChangeText={onChangeTextInput}
				onSubmitEditing={addToDo}
				returnKeyType="done"
				value={textInput}
				placeholder={
					menuType === WORK
						? "Add what to do"
						: menuType === SEHYUN
						? "Hi Sehyun!!"
						: "Where do you want to go"
				}
				style={styles.input}
			></TextInput>
			<ScrollView>
				{Object.keys(toDos).map((key) =>
					toDos[key].menuType === menuType ? (
						<View style={styles.toDo} key={key}>
							{toDos[key].editing ? (
								<TextInput
									onChangeText={onChangeTextEdit}
									returnKeyType="done"
									value={textEdit}
									placeholder={
										menuType === WORK
											? "Add what to do"
											: menuType === SEHYUN
											? "Hi Sehyun!!"
											: "Where do you want to go"
									}
									style={styles.toDoInput}
								></TextInput>
							) : (
								<Text
									style={{
										...styles.toDoText,
										textDecorationLine: toDos[key].done
											? "line-through"
											: "none",
										color: toDos[key].done ? "grey" : "ivory",
									}}
								>
									{toDos[key].textInput}
								</Text>
							)}
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
								}}
							>
								<TouchableOpacity
									style={{ marginHorizontal: 5 }}
									onPress={() => {
										editToDo(key);
									}}
								>
									<Entypo name="edit" size={22} color="ivory" />
								</TouchableOpacity>
								<TouchableOpacity
									style={{ marginHorizontal: 5 }}
									onPress={() => {
										doneToDo(key);
									}}
								>
									{toDos[key].done ? (
										<Fontisto name="toggle-on" size={24} color="ivory" />
									) : (
										<Fontisto name="toggle-off" size={24} color="ivory" />
									)}
								</TouchableOpacity>
								<TouchableOpacity
									style={{ marginHorizontal: 5 }}
									onPress={() => {
										deleteToDo(key);
									}}
								>
									<Fontisto name="trash" size={18} color="ivory" />
								</TouchableOpacity>
							</View>
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
	toDoInput: {
		backgroundColor: "ivory",
		fontSize: 20,
		// paddingHorizontal: 5,
		// paddingVertical: 5,
	},
});
