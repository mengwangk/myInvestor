/*
 * @Author: mwk 
 * @Date: 2017-07-31 23:58:29 
 * @Last Modified by:   mwk 
 * @Last Modified time: 2017-07-31 23:58:29 
 */

export const getNavigationOptions = (title, backgroundColor, color) => ({
  title,
  headerTitle: title,
  headerStyle: {
    backgroundColor
  },
  headerTitleStyle: {
    color
  },
  headerTintColor: color
});

export const getNavigationOptionsWithAction = (
  title,
  backgroundColor,
  color,
  headerLeft
) => ({
  title,
  headerStyle: {
    backgroundColor
  },
  headerTitleStyle: {
    color
  },
  headerTintColor: color,
  headerLeft
});

export const getDrawerNavigationOptions = (
  title,
  backgroundColor,
  titleColor,
  drawerIcon
) => ({
  title,
  headerTitle: title,
  headerStyle: {
    backgroundColor
  },
  headerTitleStyle: {
    color: titleColor
  },
  headerTintColor: titleColor,
  drawerLabel: title,
  drawerIcon
});

export const getDrawerConfig = (
  drawerWidth,
  drawerPosition,
  initialRouteName
) => ({
  drawerWidth,
  drawerPosition,
  initialRouteName
});
