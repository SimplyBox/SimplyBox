import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
    onSubmit: (email: string, password: string) => Promise<void>;
    isLoading: boolean;
    t: (key: string) => string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, t }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const validateForm = () => {
        const errors: { email?: string; password?: string } = {};

        if (!email.trim()) {
            errors.email = t("login.form.email.validation.emailRequired");
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = t("login.form.email.validation.emailInvalid");
        }

        if (!password) {
            errors.password = t(
                "login.form.password.validation.passwordRequired"
            );
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(email, password);
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("login.form.email.label")}
                </label>
                <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type="email"
                        placeholder={t("login.form.email.placeholder")}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) {
                                setFieldErrors((prev) => ({
                                    ...prev,
                                    email: undefined,
                                }));
                            }
                        }}
                        className="pl-10 h-12"
                    />
                </div>
                {fieldErrors.email && (
                    <p className="text-sm text-red-600">{fieldErrors.email}</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    {t("login.form.password.label")}
                </label>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={t("login.form.password.placeholder")}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.password) {
                                setFieldErrors((prev) => ({
                                    ...prev,
                                    password: undefined,
                                }));
                            }
                        }}
                        className="pl-10 pr-10 h-12"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                        )}
                    </Button>
                </div>
                {fieldErrors.password && (
                    <p className="text-sm text-red-600">
                        {fieldErrors.password}
                    </p>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) =>
                            setRememberMe(checked === true)
                        }
                    />
                    <label htmlFor="remember" className="text-sm text-gray-600">
                        {t("login.form.rememberMe")}
                    </label>
                </div>
                <Button
                    variant="link"
                    className="text-sm text-blue-500 hover:text-blue-600 p-0"
                >
                    {t("login.form.forgotPassword")}
                </Button>
            </div>

            <Button
                type="submit"
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white font-medium"
                disabled={isLoading}
            >
                {isLoading ? t("login.form.signingIn") : t("login.form.signIn")}
            </Button>
        </form>
    );
};

export default LoginForm;
