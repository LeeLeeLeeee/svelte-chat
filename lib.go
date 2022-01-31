package main

import "reflect"

/* slice lib */
func FindIndex(slice interface{}, f func(value interface{}) bool) int {
	s := reflect.ValueOf(slice)
	if s.Kind() == reflect.Slice {
		for index := 0; index < s.Len(); index++ {
			if f(s.Index(index).Interface()) {
				return index
			}
		}
	}
	return -1
}

func RemoveItemOfSlice(slice interface{}, index int) interface{} {
	s := reflect.ValueOf(slice)
	if s.Kind() == reflect.Slice {
		value := s.Elem()
		return reflect.Append(value.Slice(0, index), value.Slice(index+1, s.Len()))
	}
	return nil
}
