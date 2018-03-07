<?php
class Util_Array
{
    /**
     * 数组是否只包含某个元素
     *
     * @param  array  $array    indexed array or associate array
     * @param  mixed  $property
     * @return boolean
     */
    public static function hasPropertyOnly(array $array, $property) {
        // return count($array) === 1 && array_key_exists($property, $array);
        return count($array) === 1 && (array_key_exists($property, $array) || in_array($property, $array));
    }

    /**
     * 索引数组扁平化
     * @param  array  $array    多维数组
     * @return array           一维数组
     */
    public static function flatten(array $multiDimensionArray) {
        return array_reduce($multiDimensionArray, function ($carry, $item) {
            if (!is_array($item)) {
                array_push($carry, $item);

                return $carry;
            }

            return array_merge($carry, self::flatten($item));
        }, []);
    }

    /**
     * 根据回调函数从数组中搜索并返回第一个符合条件的元素，找不到返回 null
     * @param  array    $array
     * @param  callable $predict
     * @return Mixed|null
     */
    public static function find(array $array, callable $predict) {
        $items = array_values(array_filter($array, $predict));

        return count($items) > 0 ? $items[0] : null;
    }
}
?>
