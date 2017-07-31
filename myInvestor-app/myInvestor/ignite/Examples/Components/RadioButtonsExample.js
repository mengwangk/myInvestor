import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'
import ExamplesRegistry from '../../../App/Services/ExamplesRegistry'
import { RadioButtons } from 'react-native-radio-buttons'

// Example
ExamplesRegistry.addPluginExample('RadioButtons', () =>
  <View style={{margin: 20}}>
    <RadioButtons
      options={options}
      onSelection={ setSelectedOption.bind(this) }
      selectedOption={ options.first } // In your application, this would be { this.state.selectedOption }
      renderOption={ renderOption }
      renderContainer={ renderContainer }
    />
  </View>
)

const options = [
  "Option 1",
  "Option 2"
]

const setSelectedOption = (selectedOption) => {
  // In your application code, you would set selectedOption in state: `this.setState({selectedOption: selectedOption})`
  window.alert(`${selectedOption} pressed`)
}

const renderOption = (option, selected, onSelect, index) => {
  const style = selected ? { fontWeight: 'bold'} : {}

  return (
    <TouchableWithoutFeedback onPress={onSelect} key={index}>
      <View>
        <Text style={[style, { color: 'white'}]}>{option}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
}

const renderContainer = (optionNodes) => {
  return <View>{optionNodes}</View>
}
