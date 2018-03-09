<?php
/**
 * Call `protected/private` static method of a class or instance
 * 允许调用 `private` 或 `protected` 的静态或实例方法，常用使用场景：单元测试
 *
 * @example
 * class SchemaTest extends PHPUnit_Framework_TestCase {
 *     use MethodInvoker;
 *
 *     public function testValidateCategoryPredictionFields3() {
 *         $this->invokeInstanceMethod($schema, 'validateCategoryPredictionFields', $categoryPredictionFields);
 *     }
 *}
 */
trait MethodInvoker {
    /**
     * Call protected/private static method of a class.
     *
     * @param string $class class name that we will run method on
     * @param string $methodName method name to call
     * @param array  $parameters parameters to pass into method
     *
     * @return mixed original method's return
     */
    public static function invokeStaticMethod($class, $methodName, $parameters) {
        $reflectionClass = new ReflectionClass($class);
        $method = $reflectionClass->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invoke($class, $parameters);
    }

    /**
     * Call protected/private method of an instance.
     *
     * @param \Model\Model $instance instance that we will run method on
     * @param string $methodName method name to call
     * @param mixed $parameters,... unlimited parameters to pass into method
     *
     * @return mixed original method's return
     *
     * @example
     * $schema = new Schema();
     * $this->invokeInstanceMethod($schema, 'validateCategoryPredictionFields', ['cate_id', 'title'], 'p2', 'p3');
     * // equals to `schema->validateCategoryPredictionFields(['cate_id', 'title'], 'p2', 'p3')`
     */
    public static function invokeInstanceMethod(\Model\Model $instance, $methodName, ...$parameters) {
        $reflection = new ReflectionObject($instance);
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);

        return $method->invoke($instance, ...$parameters);
    }
}
