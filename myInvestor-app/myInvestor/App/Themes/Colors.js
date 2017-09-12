/*
 * @Author: mwk 
 * @Date: 2017-08-02 14:25:42 
 * @Last Modified by: mwk
 * @Last Modified time: 2017-09-11 15:22:25
 */
import { Platform } from "react-native";

const colors = {
  background: "#1F0808",
  clear: "rgba(0,0,0,0)",
  facebook: "#3b5998",
  transparent: "rgba(0,0,0,0)",
  steel: "#CCCCCC",
  error: "rgba(200, 0, 0, 0.8)",
  ricePaper: "rgba(255,255,255, 0.75)",
  frost: "#D8D8D8",
  cloud: "rgba(200,200,200, 0.35)",
  windowTint: "rgba(0, 0, 0, 0.4)",
  panther: "#161616",
  charcoal: "#595959",
  coal: "#2d2d2d",
  bloodOrange: "#fb5f26",
  ember: "rgba(164, 0, 48, 0.5)",
  fire: "#e73536",
  drawer: "rgba(30, 30, 29, 0.95)",
  eggplant: "#251a34",
  border: "#483F53",
  banner: "#5F3E63",

  snow: "white",
  red: "#E64044",
  redShadow: "#E83E3F",
  silver: "#F3F5F6",
  purple: "#5C195A",
  darkPurple: "#140034",
  purpleShadow1: "#694F6C",
  purpleShadow2: "#B997BC",
  purpleShadow3: "#6E3C7B",
  headerPurple: "#571757",
  avatarBorder: "#DCE3E8",
  lightText: "#656565",
  text: "#000000",
  transparentBump:
    Platform.OS === "ios" ? "rgba(140,42,140, 0.5)" : "rgba(140,42,140, 0.9)",

  selected: "#202020",
  redOrange: "#FC3D39",
  emerald: "#53D769"
};

export default colors;
