import React, { Component } from "react";
import { Animated, StyleSheet, Text, TouchableWithoutFeedback, View, Dimensions } from "react-native";
import PropTypes from "prop-types";
import * as constant from "../Helper/Constants";

export default class SegmentControl extends Component {
    static propTypes = {
        borderWidth: PropTypes.number,
        borderRadius: PropTypes.number,
        borderColor: PropTypes.string,
        backgroundColor: PropTypes.string,
        textPadding: PropTypes.number,
        textColor: PropTypes.string,
        selectedBorderRadius: PropTypes.number,
        selectedBackgroundColor: PropTypes.string,
        selectedTextColor: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.string),
        onChange: PropTypes.func,
        onValueChange: PropTypes.func,
        viewWidth: PropTypes.number,
        viewHeight: PropTypes.number,
        selectedIndex: PropTypes.number,
    };

    static defaultProps = {
        borderWidth: 1,
        borderRadius: 1,
        borderColor: "#000",
        backgroundColor: "#fff",
        textPadding: 2,
        textColor: constant.themeColor, // change according to use
        selectedBorderRadius: undefined,
        selectedBackgroundColor: constant.themeColor,
        selectedTextColor: "#fff",
        values: [],
        viewWidth: Dimensions.get("window").width,
        viewHeight: 40,
        selectedIndex: 0,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedIndex: this.props.selectedIndex,
            thumbPosition: new Animated.Value(this.props.selectedIndex),
            textWidth: undefined,
            textHeight: undefined,
        };
    }

    handleSelected(idx) {
        const { values, onChange, onValueChange } = this.props;
        const { thumbPosition } = this.state;

        onChange && onChange({ index: idx, value: values[idx] });
        onValueChange && onValueChange(values[idx]);

        this.setState({ selectedIndex: idx });
        Animated.timing(thumbPosition, { toValue: idx, duration: 300 }).start();
    }

    handleTextsLayout(layouts) {
        const { values, viewWidth, viewHeight } = this.props;
        let textHeight = 0;
        let textWidth = 0;
        layouts.forEach(({ width, height }) => {
            if (width >= textWidth) {
                textWidth = width;
                textHeight = height;
            }
        });
        textWidth = viewWidth / values.length;
        textHeight = viewHeight;
        if (textWidth === this.state.textWidth) return;
        this.setState({ textWidth, textHeight });
    }

    getRootStyle() {
        const { borderWidth, borderRadius, borderColor, backgroundColor, style } = this.props;

        return [
            styles.root,
            {
                borderWidth,
                borderRadius,
                borderColor,
                backgroundColor,
            },
            style,
        ];
    }

    getThumbStyle() {
        const { borderRadius, selectedBorderRadius, selectedBackgroundColor, values, viewWidth } = this.props;
        const { thumbPosition, textWidth = 0, textHeight } = this.state;
        return [
            styles.thumb,
            {
                width: textWidth,
                // width: viewWidth / values.length,
                height: textHeight,
                borderRadius: selectedBorderRadius === undefined ? borderRadius : selectedBorderRadius,
                backgroundColor: selectedBackgroundColor,
                transform: [
                    {
                        translateX: thumbPosition.interpolate({
                            inputRange: [0, values.length - 1],
                            outputRange: [0, (values.length - 1) * textWidth],
                        }),
                    },
                ],
            },
        ];
    }

    getTextStyle(idx) {
        const { textPadding, textColor, selectedTextColor } = this.props;
        const { selectedIndex, textWidth, textHeight } = this.state;

        return [
            styles.text,
            {
                width: textWidth,
                // height: textHeight,
                // padding: textPadding,
                color: selectedIndex === idx ? selectedTextColor : textColor,
            },
        ];
    }

    render() {
        const { values, viewHeight } = this.props;

        const onLayouts = [];
        const promises = values.map(
            (v, i) =>
                new Promise((resolve, reject) => {
                    onLayouts[i] = e => resolve(e.nativeEvent.layout);
                })
        );
        Promise.all(promises).then(this.handleTextsLayout.bind(this));

        const optionViews = values.map((val, idx) => (
            <TouchableWithoutFeedback
                style={{ height: viewHeight, backgroundColor: "green" }}
                key={idx}
                onPress={() => this.handleSelected(idx)}
                onLayout={onLayouts[idx]}
            >
                <View
                    style={{
                        height: viewHeight,
                        // backgroundColor: "green",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text style={this.getTextStyle(idx)}>{val}</Text>
                </View>
            </TouchableWithoutFeedback>
        ));

        return (
            <View style={styles.conatiner}>
                <View style={this.getRootStyle()}>
                    <Animated.View style={this.getThumbStyle()} />
                    {optionViews}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    conatiner: {
        alignItems: "center",
        justifyContent: "center",
    },
    root: {
        flexDirection: "row",
        overflow: "hidden",
    },
    thumb: {
        position: "absolute",
    },
    text: {
        backgroundColor: "transparent",
        textAlign: "center",
    },
});
