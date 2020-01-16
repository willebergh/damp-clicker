import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Button, AsyncStorage } from "react-native";

const styles = StyleSheet.create({
    root: {
        padding: 32
    },

    scoreboard: {
        display: "flex",
        justifyContent: "flex-start"
    },
    scoreboardRow: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "nowrap",
        justifyContent: "space-between",
        alignItems: "center"
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
});

export default function RaceScreen() {
    const [clicks, setClicks] = React.useState(0);

    const [playTime, setPlayTime] = React.useState(10);
    const [time, setTime] = React.useState(playTime)


    const [records, setRecords] = React.useState({});
    const [hasEnded, setHasEnded] = React.useState(false);
    const [currentRecord, setCurrentRecord] = React.useState({
        clicks: "", playTime: "", clicksPerSecond: "",
    });
    const [raceStats, setRaceStats] = React.useState({
        clicks: "", playTime: "", clicksPerSecond: ""
    });

    React.useEffect(() => {
        getRecords();
    }, [])

    React.useEffect(() => {
        if (hasEnded) {
            handleRaceEnd();
        }
    }, [hasEnded]);

    const getRecords = async () => {
        try {
            const newRecords = JSON.parse(await AsyncStorage.getItem("race-records"));
            setRecords(newRecords !== null ? newRecords : {});
        } catch (err) {
            console.error(err);
        }
    }

    const handleClick = e => {
        if (!hasEnded) {
            const newClicks = clicks + 1;
            setClicks(newClicks);
            if (clicks === 0) {
                initTimer();
            }
        }
    }

    const initTimer = () => {
        var secondsElapsed = 0;
        updateTime();
        const timer = setInterval(updateTime, 1000);
        function updateTime() {
            if (secondsElapsed === playTime) {
                clearTimeout(timer);
                setHasEnded(true);
            } else {
                const newTime = playTime - secondsElapsed;
                setTime(newTime);
            }
            secondsElapsed++;
        }

    }

    const handleRaceEnd = async () => {
        const newRaceStats = {
            clicks,
            playTime,
            clicksPerSecond: clicks / playTime
        }

        const getNewRecords = () => {
            if (!records.hasOwnProperty(playTime)) {
                return { ...records, [playTime]: newRaceStats };
            } else {
                const current = records[playTime];
                const newRecord = {
                    playTime,
                    clicks: newRaceStats.clicks > current.clicks ? newRaceStats.clicks : current.clicks,
                    clicksPerSecond: newRaceStats.clicksPerSecond > current.clicksPerSecond ? newRaceStats.clicksPerSecond : current.clicksPerSecond
                }
                return { ...records, [playTime]: newRecord };
            }
        }

        try {
            const newRecords = getNewRecords();
            await AsyncStorage.setItem("race-records", JSON.stringify(newRecords));
            setRaceStats(newRaceStats);
            setRecords(newRecords);
            setCurrentRecord(newRecords[playTime])
        } catch (err) {
            console.error(err);
        }
    }

    const handleReset = e => {
        setClicks(0);
        setTime(playTime);
        setHasEnded(false);
    }


    if (hasEnded) {
        return (
            <View style={styles.root}>
                <View>
                    <View style={styles.scoreboardRow}>
                        <Text style={styles.scoreboardText}>Time:</Text>
                        <Text style={styles.scoreboardText}>{raceStats.playTime} s</Text>
                    </View>
                    <View style={styles.scoreboardRow}>
                        <View>
                            <Text style={styles.scoreboardText}>Total Clicks:</Text>
                            <Text>Record: {currentRecord.clicks}</Text>
                        </View>
                        <Text style={styles.scoreboardText}>{raceStats.clicks}</Text>
                    </View>
                    <View style={styles.scoreboardRow}>
                        <View>
                            <Text style={styles.scoreboardText}>Clicks / Second:</Text>
                            <Text>Record: {currentRecord.clicksPerSecond}</Text>
                        </View>
                        <Text style={styles.scoreboardText}>{raceStats.clicksPerSecond}</Text>
                    </View>
                    <Button style={styles.scoreboardText} title="Play Again" onPress={handleReset} />
                </View>
            </View>
        )
    } else {
        return (
            <View style={styles.root}>
                <View>
                    <View style={styles.scoreboard}>
                        <View style={styles.scoreboardRow}>
                            <Text style={styles.scoreboardText}>Clicks:</Text>
                            <Text style={styles.scoreboardText}>{clicks}</Text>
                        </View>
                        <View style={styles.scoreboardRow}>
                            <Text style={styles.scoreboardText}>Time:</Text>
                            <Text style={styles.scoreboardText}>{time} s</Text>
                        </View>
                        <Button title="Reset" onPress={handleReset} />
                    </View>
                    <View style={styles.game}>
                        <TouchableOpacity style={styles.clickBox} onPress={handleClick}>
                            <Text style={styles.clickBoxText}>Click Me</Text>
                        </TouchableOpacity>
                    </View>
                </View >
            </View >
        )
    }
}

RaceScreen.navigationOptions = {
    title: "Race"
}
