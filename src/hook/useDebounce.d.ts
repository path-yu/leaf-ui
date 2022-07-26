interface DebounceFunc {
    (fn: Function, wait: number | undefined): any;
}
declare const useDebounce: DebounceFunc;
export default useDebounce;
