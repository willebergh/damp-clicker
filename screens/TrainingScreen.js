import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import moment from "moment";

export default function TrainingScreen() {
    const [clicks, setClicks] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [clicksPerSecond, setClicksPerSecond] = useState(0);

    const handleClick = e => {

        const newClicks = clicks + 1;
        setClicks(newClicks);

        if (clicks === 0) {
            setStartTime(new Date());
        } else {
            const newClicksPerSecond = newClicks / ((new Date()) - startTime) * 1000;
            setClicksPerSecond(newClicksPerSecond);
        }

    }

    const handleReset = e => {
        setClicks(0);
        setStartTime(0);
        setClicksPerSecond(0);
    }

    return (
        <View style={styles.root}>
            <View>
                <View style={styles.scoreboard}>
                    <View style={styles.scoreboardRow}>
                        <Text style={styles.scoreboardText}>Total Clicks:</Text>
                        <Text style={styles.scoreboardText}>{clicks}</Text>
                    </View>
                    <View style={styles.scoreboardRow}>
                        <Text style={styles.scoreboardText}>Clicks / Seconds:</Text>
                        <Text style={styles.scoreboardText}>{clicksPerSecond.toFixed(2)}</Text>
                    </View>
                    <Button title="Reset" onPress={handleReset} />
                </View>
                <View style={styles.game}>
                    <TouchableOpacity style={styles.clickBox} onPress={handleClick}>
                        <Text style={styles.clickBoxText}>Click Me</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

TrainingScreen.navigationOptions = {
    title: "Game"
}

const styles = StyleSheet.create({
    root: {
        padding: 32
    },
    scoreboard: {

    },
    scoreboardRow: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between"
    },
    scoreboardText: {
        fontSize: 24,
        fontWeight: "500"

    },
    game: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%"
    },
    clickBox: {
        width: 300,
        height: 300,
        backgroundColor: "#1E90FF",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        borderRadius: 24
    },
    clickBoxText: {
        fontSize: 48,
        fontWeight: "500",
        color: "#fff"
    }
})